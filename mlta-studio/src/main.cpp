#ifdef MLTA_STUDIO_WITH_QT

#include "mlta_studio/main_window.hpp"

#include <QApplication>

int main(int argc, char* argv[]) {
    QApplication app(argc, argv);
    QApplication::setApplicationName("MLTA Studio");
    QApplication::setOrganizationName("ArkansasIo");

    mlta::studio::MainWindow window;
    window.show();
    return app.exec();
}

#else

#include <iostream>

int main() {
    std::cout
        << "MLTA Studio - C++23 development environment\n"
        << "The Qt 6 Widgets dependency was not found, so this build provides "
           "the bootstrap CLI.\n"
        << "Install Qt 6.4+ with the Widgets component and configure again "
           "to enable the desktop GUI.\n";
    return 0;
}

#endif
