const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

const SCREENSHOTS_DIR =
    path.join(__dirname, '..', 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

let driver;

async function tiraFoto(nome) {
    const imagem =
        await driver.takeScreenshot();

    fs.writeFileSync(
        path.join(
            SCREENSHOTS_DIR,
            `${nome}.png`
        ),
        imagem,
        'base64'
    );
}

async function main() {

    try {

        const opts =
            new chrome.Options();

        opts.addArguments(
            '--headless=new',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--window-size=1280,720'
        );

        driver =
            await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(opts)
            .build();

        await driver.get(BASE_URL);

        await tiraFoto('pagina_inicial');

        await driver
            .findElement(By.id('peso'))
            .sendKeys('78');

        await driver
            .findElement(By.id('altura'))
            .sendKeys('1.70');

        await tiraFoto('dados_preenchidos');

        await driver
            .findElement(By.id('calcular'))
            .click();

        await new Promise(
            r => setTimeout(r, 1000)
        );

        await tiraFoto('resultado');

        const texto =
            await driver
                .findElement(By.id('resultado'))
                .getText();

        console.log(texto);

    } finally {

        if (driver)
            await driver.quit();

    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});