(function () {
    'use strict';

    // Параметры верхней панели
    let enabled = true;
    let idleOpacity = 0;

    // Параметры кнопки сворачивания плеера
    let closeButtonEnabled = true;
    let closeButtonOpacity = 0;

    // Динамический элемент стилей
    const styleEl = document.createElement('style');
    styleEl.id = 'pulsesync-autohide-style';
    (document.head || document.documentElement).appendChild(styleEl);

    // Вспомогательная функция чтения значений из конфига
    function readValue(settings, key, fallback) {
        if (!settings) return fallback;
        const entry = settings[key];
        if (entry !== null && typeof entry === 'object' && !Array.isArray(entry)) {
            if (typeof entry.value !== 'undefined') return entry.value;
            if (typeof entry.default !== 'undefined') return entry.default;
        }
        return typeof entry !== 'undefined' ? entry : fallback;
    }

    // Формирование и применение CSS
    function applyStyles() {
        let css = '';

        // 1. Стили для верхней панели (TitleBar + Reload)
        if (enabled) {
            css += `
                [class*="TitleBar_root"],
                [class*="TitleBar_button"],
                #sr-reload-button {
                    opacity: ${idleOpacity} !important;
                    transition: opacity 0.2s ease-in-out !important;
                }

                [class*="TitleBar_root"]:hover,
                [class*="TitleBar_button"]:hover,
                #sr-reload-button:hover {
                    opacity: 1 !important;
                }
            `;
        }

        // 2. Стили для кнопки закрытия полноэкранного плеера
        if (closeButtonEnabled) {
            css += `
                [data-test-id="FULLSCREEN_PLAYER_CLOSE_BUTTON"],
                [class*="FullscreenPlayerDesktop_closeButton"] {
                    opacity: ${closeButtonOpacity} !important;
                    transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out !important;
                }

                [data-test-id="FULLSCREEN_PLAYER_CLOSE_BUTTON"]:hover,
                [class*="FullscreenPlayerDesktop_closeButton"]:hover {
                    opacity: 1 !important;
                }
            `;
        }

        styleEl.textContent = css;
    }

    // Обновление состояния из интерфейса настроек
    function applySettings(settings) {
        enabled = Boolean(readValue(settings, 'enabled', true));
        idleOpacity = parseFloat(readValue(settings, 'opacityLevel', 0));

        closeButtonEnabled = Boolean(readValue(settings, 'closeButtonEnabled', true));
        closeButtonOpacity = parseFloat(readValue(settings, 'closeButtonOpacity', 0));

        applyStyles();
    }

    // Инициализация API PulseSync (укажите точное имя из вашего metadata.json)
    const store = window.pulsesyncApi?.getSettings('Hide TitleBar Buttons') ?? {
        getCurrent: () => ({}),
        onChange: () => () => {},
    };

    applySettings(store.getCurrent());

    store.onChange(nextSettings => {
        applySettings(nextSettings);
    });

})();