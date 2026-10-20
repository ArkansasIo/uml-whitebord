#include "mlta_studio/main_window.hpp"
#include "mlta/engine.hpp"
#include "mlta_studio/catalog.hpp"

#include <QAction>
#include <QApplication>
#include <QDockWidget>
#include <QFileDialog>
#include <QFile>
#include <QFontDatabase>
#include <QLabel>
#include <QMenuBar>
#include <QMessageBox>
#include <QPlainTextEdit>
#include <QSplitter>
#include <QStatusBar>
#include <QTextStream>
#include <QToolBar>
#include <QTreeWidget>
#include <QTreeWidgetItem>
#include <QVBoxLayout>
#include <QWidget>

namespace mlta::studio {

MainWindow::MainWindow(QWidget* parent) : QMainWindow(parent) {
    setWindowTitle("MLTA Studio");
    resize(1440, 900);
    createActions();
    createMenus();
    createToolBar();
    createWorkspace();
    createStatusArea();
}

void MainWindow::createActions() {
    auto* newAction = new QAction("New Project", this);
    newAction->setShortcut(QKeySequence::New);
    connect(newAction, &QAction::triggered, this, [this] {
        editor_->clear();
        editor_->setPlaceholderText("Start writing an MLTA logic specification...");
        appendDiagnostic("Created a new unsaved document.");
    });
    addAction(newAction);
    newAction->setObjectName("actionNewProject");

    auto* openAction = new QAction("Open File...", this);
    openAction->setShortcut(QKeySequence::Open);
    connect(openAction, &QAction::triggered, this, [this] {
        const QString path = QFileDialog::getOpenFileName(
            this, "Open MLTA source", {}, "MLTA files (*.mlta *.alg *.txt);;All files (*)");
        if (path.isEmpty()) return;
        QFile file(path);
        if (!file.open(QIODevice::ReadOnly | QIODevice::Text)) {
            QMessageBox::warning(this, "Open failed", file.errorString());
            return;
        }
        editor_->setPlainText(QString::fromUtf8(file.readAll()));
        appendDiagnostic("Opened: " + path);
    });
    addAction(openAction);

    auto* saveAction = new QAction("Save As...", this);
    saveAction->setShortcut(QKeySequence::SaveAs);
    connect(saveAction, &QAction::triggered, this, [this] {
        const QString path = QFileDialog::getSaveFileName(
            this, "Save MLTA source", "untitled.mlta", "MLTA files (*.mlta);;Text files (*.txt)");
        if (path.isEmpty()) return;
        QFile file(path);
        if (!file.open(QIODevice::WriteOnly | QIODevice::Text)) {
            QMessageBox::warning(this, "Save failed", file.errorString());
            return;
        }
        QTextStream stream(&file);
        stream << editor_->toPlainText();
        appendDiagnostic("Saved: " + path);
    });
    addAction(saveAction);

    auto* validateAction = new QAction("Validate", this);
    validateAction->setShortcut(QKeySequence("F7"));
    connect(validateAction, &QAction::triggered, this, [this] {
        const QString source = editor_->toPlainText();
        if (source.trimmed().isEmpty()) {
            appendDiagnostic("Validation failed: editor is empty.");
            statusBar()->showMessage("Validation failed", 3000);
            return;
        }
        const mlta::MLTAEngine engine;
        const auto result = engine.validate(source.toStdString());
        appendDiagnostic(result.valid ? "Validation passed." : "Validation failed.");
        for (const auto& diagnostic : result.diagnostics.entries) {
            appendDiagnostic(QString::fromStdString(diagnostic.code + ": " + diagnostic.message));
        }
        statusBar()->showMessage(result.valid ? "Validation passed" : "Validation failed", 3000);
    });
    addAction(validateAction);

    auto* runAction = new QAction("Run", this);
    runAction->setShortcut(QKeySequence("F5"));
    connect(runAction, &QAction::triggered, this, [this] {
        const mlta::MLTAEngine engine;
        const auto result = engine.execute(editor_->toPlainText().toStdString());
        appendDiagnostic(result.success ? "Execution succeeded." : "Execution failed.");
        appendDiagnostic("Instructions used: " + QString::number(static_cast<qulonglong>(result.instructionsUsed)));
        if (const auto* booleanValue = std::get_if<bool>(&result.value.data)) appendDiagnostic(*booleanValue ? "Result: true" : "Result: false");
        else if (const auto* integerValue = std::get_if<std::int64_t>(&result.value.data)) appendDiagnostic("Result: " + QString::number(static_cast<qlonglong>(*integerValue)));
        else if (const auto* floatValue = std::get_if<double>(&result.value.data)) appendDiagnostic("Result: " + QString::number(*floatValue));
        else if (const auto* stringValue = std::get_if<std::string>(&result.value.data)) appendDiagnostic("Result: " + QString::fromStdString(*stringValue));
        for (const auto& line : result.trace) appendDiagnostic("Trace: " + QString::fromStdString(line));
        for (const auto& diagnostic : result.diagnostics.entries) appendDiagnostic(QString::fromStdString(diagnostic.code + ": " + diagnostic.message));
        statusBar()->showMessage(result.success ? "Execution succeeded" : "Execution failed", 3000);
    });
    addAction(runAction);
}

void MainWindow::createMenus() {
    auto* fileMenu = menuBar()->addMenu("&File");
    for (const auto& actionName : {"actionNewProject"}) {
        if (auto* action = findChild<QAction*>(actionName)) fileMenu->addAction(action);
    }
    for (const auto& action : actions()) {
        if (action->shortcut() == QKeySequence::Open || action->shortcut() == QKeySequence::SaveAs)
            fileMenu->addAction(action);
    }

    auto* editMenu = menuBar()->addMenu("&Edit");
    auto* undoAction = editor_ ? editor_->undoAvailable() ? new QAction("Undo", this) : new QAction("Undo", this)
                               : new QAction("Undo", this);
    undoAction->setShortcut(QKeySequence::Undo);
    connect(undoAction, &QAction::triggered, this, [this] { editor_->undo(); });
    editMenu->addAction(undoAction);
    auto* redoAction = new QAction("Redo", this);
    redoAction->setShortcut(QKeySequence::Redo);
    connect(redoAction, &QAction::triggered, this, [this] { editor_->redo(); });
    editMenu->addAction(redoAction);

    auto* viewMenu = menuBar()->addMenu("&View");
    viewMenu->addAction("Reset Layout", this, [this] { statusBar()->showMessage("Layout reset requested", 2000); });

    auto* buildMenu = menuBar()->addMenu("&Build");
    for (auto* action : findChildren<QAction*>()) {
        if (action->text() == "Validate" || action->text() == "Run") buildMenu->addAction(action);
    }

    auto* helpMenu = menuBar()->addMenu("&Help");
    helpMenu->addAction("About MLTA Studio", this, [this] {
        QMessageBox::about(this, "About MLTA Studio",
            "MLTA Studio 0.1.0\nA C++23 desktop shell for the MLTA application and logic engine.\n"
            "The editor shell is an early scaffold; parser, runtime, and persistence integrations are pending.");
    });
}

void MainWindow::createToolBar() {
    auto* toolbar = addToolBar("Main");
    toolbar->setObjectName("mainToolBar");
    toolbar->setMovable(true);
    for (auto* action : findChildren<QAction*>()) {
        if (action->text() == "New Project" || action->text() == "Open File..." ||
            action->text() == "Save As..." || action->text() == "Validate" ||
            action->text() == "Run") {
            toolbar->addAction(action);
        }
    }
}

void MainWindow::createWorkspace() {
    auto* root = new QSplitter(Qt::Horizontal, this);

    projectTree_ = new QTreeWidget(root);
    projectTree_->setHeaderLabel("Project");
    auto* project = new QTreeWidgetItem(projectTree_, {"MLTA Project"});
    new QTreeWidgetItem(project, {"Sources"});
    new QTreeWidgetItem(project, {"Modules"});
    new QTreeWidgetItem(project, {"Tests"});
    new QTreeWidgetItem(project, {"Assets"});
    project->setExpanded(true);
    projectTree_->setMinimumWidth(190);

    auto* center = new QSplitter(Qt::Vertical, root);
    auto* editorPanel = new QWidget(center);
    auto* editorLayout = new QVBoxLayout(editorPanel);
    editorLayout->setContentsMargins(6, 6, 6, 6);
    editorLayout->addWidget(new QLabel("Source Editor", editorPanel));
    editor_ = new QPlainTextEdit(editorPanel);
    editor_->setObjectName("sourceEditor");
    editor_->setPlaceholderText("Example:\nmaster Demo {\n  statement: true\n}");
    editor_->setFont(QFontDatabase::systemFont(QFontDatabase::FixedFont));
    editorLayout->addWidget(editor_);

    auto* lower = new QSplitter(Qt::Horizontal, center);
    logicTree_ = new QTreeWidget(lower);
    logicTree_->setHeaderLabel("Logic Outline");
    auto* master = new QTreeWidgetItem(logicTree_, {"Master"});
    new QTreeWidgetItem(master, {"Statement"});
    new QTreeWidgetItem(master, {"Branch"});
    new QTreeWidgetItem(master, {"Module"});
    new QTreeWidgetItem(master, {"Class"});
    new QTreeWidgetItem(master, {"Type"});
    new QTreeWidgetItem(master, {"Array"});
    new QTreeWidgetItem(master, {"Operation"});
    new QTreeWidgetItem(master, {"Function"});
    master->setExpanded(true);

    output_ = new QPlainTextEdit(lower);
    output_->setReadOnly(true);
    output_->setObjectName("diagnosticsOutput");
    output_->setPlaceholderText("Diagnostics, validation messages, and execution traces appear here.");
    output_->appendPlainText("MLTA Studio initialized.");
    lower->addWidget(logicTree_);
    lower->addWidget(output_);
    lower->setSizes({280, 520});

    center->addWidget(editorPanel);
    center->addWidget(lower);
    center->setSizes({520, 240});

    root->addWidget(projectTree_);
    root->addWidget(center);
    root->setStretchFactor(0, 0);
    root->setStretchFactor(1, 1);
    root->setSizes({230, 1100});
    setCentralWidget(root);

    auto* componentsDock = new QDockWidget("Components & Fields", this);
    componentsDock->setObjectName("componentsFieldsDock");
    auto* components = new QTreeWidget(componentsDock);
    components->setHeaderLabels({"Component / Field", "Type"});
    for (const auto& definition : componentCatalog()) {
        auto* category = new QTreeWidgetItem(components, {QString::fromStdString(definition.category), ""});
        auto* component = new QTreeWidgetItem(category, {QString::fromStdString(definition.name), QString::fromStdString(definition.description)});
        for (const auto& field : definition.fields) {
            auto* fieldItem = new QTreeWidgetItem(component, {QString::fromStdString(field.name), QString::fromStdString(field.type)});
            fieldItem->setToolTip(0, QString::fromStdString(field.description));
            if (field.required) fieldItem->setText(1, QString::fromStdString(field.type + " (required)"));
        }
        category->setExpanded(true);
    }
    componentsDock->setWidget(components);
    addDockWidget(Qt::RightDockWidgetArea, componentsDock);

    auto* toolsDock = new QDockWidget("Toolbox", this);
    toolsDock->setObjectName("toolboxDock");
    auto* tools = new QTreeWidget(toolsDock);
    tools->setHeaderLabels({"Tool", "Shortcut"});
    for (const auto& tool : toolCatalog()) {
        auto* item = new QTreeWidgetItem(tools, {QString::fromStdString(tool.name), QString::fromStdString(tool.shortcut)});
        item->setToolTip(0, QString::fromStdString(tool.description));
    }
    toolsDock->setWidget(tools);
    addDockWidget(Qt::RightDockWidgetArea, toolsDock);
}

void MainWindow::createStatusArea() {
    footerLabel_ = new QLabel("Ready | C++23 | MLTA Studio 0.1.0", this);
    statusBar()->addPermanentWidget(footerLabel_);
    statusBar()->showMessage("Ready");
}

void MainWindow::appendDiagnostic(const QString& message) {
    output_->appendPlainText(message);
}

} // namespace mlta::studio
