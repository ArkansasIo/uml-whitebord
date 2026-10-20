#pragma once

#include <QMainWindow>

class QPlainTextEdit;
class QTreeWidget;
class QLabel;

namespace mlta::studio {

class MainWindow final : public QMainWindow {
    Q_OBJECT

public:
    explicit MainWindow(QWidget* parent = nullptr);

private:
    void createActions();
    void createMenus();
    void createToolBar();
    void createWorkspace();
    void createStatusArea();
    void appendDiagnostic(const QString& message);

    QTreeWidget* projectTree_{nullptr};
    QTreeWidget* logicTree_{nullptr};
    QPlainTextEdit* editor_{nullptr};
    QPlainTextEdit* output_{nullptr};
    QLabel* footerLabel_{nullptr};
};

} // namespace mlta::studio
