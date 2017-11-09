const {Builder, By, Key, logging, until} = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');
// logging.installConsoleHandler();
// logging.getLogger('promise.ControlFlow').setLevel(logging.Level.ALL);


test.describe('Admin Menu', function () {
    let driver;
    this.timeout(100000);

    test.before(function *() {

        driver = yield new Builder().forBrowser('firefox').build();
        return driver.get('http://localhost:8080/litecart/admin/')
            .then(_ =>
                driver.findElement(By.name('username')).sendKeys('admin'))
            .then(_ =>
                driver.findElement(By.name('password')).sendKeys('admin', Key.RETURN)); //test implemented with enter button
        });

    try {

        test.it('countries are sorted ASC check', function* () {
            yield driver.get('http://localhost:8080/litecart/admin/?app=countries&doc=countries');

            //find amount of countries
            var  countriesTable = yield driver.findElements(By.css('#content tr.row')).then();
            for (var i = 0; i < countriesTable.length - 1; i++) { // 'length - 1' is a temporary solution to avoid 'out of array index' problem

                //have to refresh countriesTable array on next cycle iteration
                countriesTable = yield driver.findElements(By.css('#content tr.row')).then();

                //check if countries are ordered correctly
                var countryName = yield countriesTable[i].findElement(By.css('#content tr.row a')).getAttribute("textContent").then();
                var nextCountryName = yield countriesTable[i+1].findElement(By.css('#content tr.row a')).getAttribute("textContent").then();

                if(countryName > nextCountryName){
                    throw new Error('Countries order is wrong!')
                }

                else {
                    //check amount of zones and open country with != 0 zones
                    var countryLink = yield countriesTable[i].findElement(By.css('#content tr.row a')).then();
                    var countryZones = yield countriesTable[i].findElement(By.css('#content tr.row td:nth-child(6)')).getAttribute("textContent").then();

                    if (countryZones > 0) {
                        countryLink.click().then();

                        //find list of zones
                        var zonesList = yield driver.findElements(By.css('#table-zones tr')).then();
                        for (var j = 1; j < zonesList.length - 2; j++) { // 'length - 2' is a solution to cut off the footer row in the table

                            //check if zones are ordered correctly
                            var zoneName = yield zonesList[j].findElement(By.css('#table-zones td:nth-child(3)')).getAttribute("textContent").then();
                            var nextZoneName = yield zonesList[j+1].findElement(By.css('#table-zones td:nth-child(3)')).getAttribute("textContent").then();

                            if (zoneName > nextZoneName) {
                                throw new Error('Zones order is wrong!')
                            }
                        }
                        yield driver.navigate().back();
                    }
                }
            }
        });

        test.it('geo zones are sorted ASC check', function* () {
            yield driver.get('http://localhost:8080/litecart/admin/?app=geo_zones&doc=geo_zones').then();

            //find amount of countries
            var  countriesList = yield driver.findElements(By.css('#content td:nth-child(3)')).then();
            for (var i = 0; i < countriesList.length; i++) {

                //have to refresh countriesTable array on next cycle iteration
                countriesList = yield driver.findElements(By.css('#content td:nth-child(3)')).then();
                //open country
                var countryLink = yield countriesList[i].findElement(By.css('#content td:nth-child(3) a')).then();
                countryLink.click().then();

                //find list of zones
                var zonesList = yield driver.findElements(By.css('#table-zones td:nth-child(3)')).then();
                for (var j = 0; j < zonesList.length - 1; j++) { // 'length - 1' is a temporary solution to avoid 'out of array index' problem

                    //check if zones are ordered correctly
                    var zoneName = yield zonesList[j].findElement(By.css('#table-zones  td:nth-child(3) option[selected]')).getAttribute("textContent").then();
                    var nextZoneName = yield zonesList[j+1].findElement(By.css('#table-zones  td:nth-child(3) option[selected]')).getAttribute("textContent").then();

                    if (zoneName > nextZoneName) {
                        throw new Error('Zones order is wrong!')
                    }
                }
                yield driver.navigate().back();
            }
        });
    }

    catch (e) {
        console.log(e)
    }

    test.after(() => driver.quit());

});