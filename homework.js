"use strict";
// Домашнее задание:
// Бизнес поставил вам задачу добавить новую возможность в код (какую - написано ниже)
// Сначала разорвите зависимость так, чтобы можно было запустить тесты на старый код
// Затем подготовьте код к изменениям, рефакторя маленькими шагами
// В конце добавьте новую функциональность

// Введение в бизнес:
// Вы разрабатываете ПО для сети магазинов в США
// Налоговое законодательство здесь строгое и индивидуально для каждого штата
// Налог на товар складывается из базовой ставки и дополнительной ставки по категориям товаров
// Для некоторых категорий товаров налог отменяется полностью
// Для некоторых категорий товаров дополнительной ставки нет
// ----
// Сеть расширяется и вас просят добавить новые штаты каждую неделю
// Сегодня вам надо будет добавить два штата:
// Tennessee и Texas
// В Tennessee (Базовая ставка: 7%, Groceries: +5%, Prepared food: базовая, Prescription drug: базовая )
// В Texas (Базовая ставка: 6.25%, Groceries: налога нет, Prepared food: базовая, Prescription drug: налога нет )

// Вопросы и Ответы:
// Как запустить тесты?
// Закомментируейте вызов production(), раскомментируйте runTest(), запустите файл

// Какие зависимости разрывать?
// Посмотрите на тесты. Они уже ожидают функцию, которая считает сумму с налогом.
// Двигайтесь в этом направлении

// На что будет обращаться внимание при проверке?
// Главный критерий - удобство добавления новых штатов
// Следующие по важности:
// Читаемость кода
// Наличие очевидных smell'ов
// Частые коммиты, тесты проходят после кадого коммита

//############################
// Этот код можно менять как угодно

var items = {
    "milk": {price: 5.5, type: "Groceries"},
    "eggs": {price: 3.0, type: "Groceries"},
    "coca-cola": {price: 0.4, type: "Groceries"},
    "amoxicillin": {price: 6.7, type: "Groceries"},
    "aspirin": {price: 0.2, type: "PrescriptionDrug"},
    "marijuana": {price: 1.4, type: "PrescriptionDrug"},
    "hamburger": {price: 2, type: "PreparedFood"},
    "ceasar salad": {price: 4.2, type: "PreparedFood"},
};

var itemTypes =
    {
        "Groceries": {
            "Alabama" : 0,
            "Alaska" : 0,
            "Arizona" : "",
            "Arkansas" : 0.015,
            "California" : "",
            "Colorado" : "",
            "Connecticut" : ""
        },
        "PrescriptionDrug": {
            "Alabama" : "",
            "Alaska" : 0,
            "Arizona" : "",
            "Arkansas" : "",
            "California" : "",
            "Colorado" : "",
            "Connecticut" : ""
        }
    };

var taxes = {
    "Alabama" : 0.04,
    "Alaska" : 0,
    "Arizona" : 0.056,
    "Arkansas" : 0.065,
    "California" : 0.075,
    "Colorado" : 0.029,
    "Connecticut" : 0.0635
};

function AddNewState(stateName, baseTax, groceriesTax, preciptionDrugTax, preparedFoodTax){
    AddNewGroseryItemTax(groceriesTax, stateName);
    AddNeewPreciptionDrugItemTax(preciptionDrugTax, stateName);
    AddNewPreparedFoodItemTax(preparedFoodTax, stateName);
    AddNewBaseTax(stateName, baseTax);
}

function AddNewBaseTax(stateName, baseTax){
    if(baseTax)
        taxes[stateName] = baseTax;
}

function AddNewGroseryItemTax(groceriesTax, stateName) {
    if (groceriesTax)
        itemTypes.Groceries[stateName] = groceriesTax;
}

function AddNeewPreciptionDrugItemTax(preciptionDrugTax, stateName) {
    if (preciptionDrugTax)
        itemTypes.PrescriptionDrug[stateName] = preciptionDrugTax;
}

function AddNewPreparedFoodItemTax(preparedFoodTax, stateName) {
    if (!itemTypes.PreparedFood)
        itemTypes["PreparedFood"] = {};
    if (preparedFoodTax)
        itemTypes.PreparedFood[stateName] = preparedFoodTax;
}

AddNewState("Tennessee", 7, 5, 0, 0);
AddNewState("Texas", 6.25, "", 0, "");

class TaxCalculator {
    // У этой функции нелья менять интерфейс
    // Но можно менять содержимое
    calculateTax() {
        var stateName = getSelectedState();
        printSelectedState(stateName);
        for (var i = 0; i < getOrdersCount(); i++) {
            console.log(`${item}: $${calculatePriceFor(stateName, getSelectedItem()).toFixed(2)}`);
        }
        printHaveANiceDay();
    }
}

function printSelectedState(stateName) {
    console.log(`----------${stateName}-----------`);
}
function printHaveANiceDay() {
    console.log(`----Have a nice day!-----`);
}

function calculatePriceFor(stateName, itemName) {
    if (items[itemName].type === "PreparedFood") {
        return calculatePriceForPreparedFood(stateName, itemName);
    }
    else {
        return calculatePriceForOtherFood(stateName, itemName);
    }
}

function calculatePriceForPreparedFood(stateName, itemName) {
    return ( 1 + taxes[stateName] ) * items[itemName].price;
}

function calculatePriceForOtherFood(stateName, itemName) {
    return calculateTax(stateName, items[itemName].type) * items[itemName].price + items[itemName].price;
}

function calculateTax(stateName, itemType) {
    var itemTypeTaxModifier = itemTypes[itemType];
    if (itemTypeTaxModifier[stateName] === "") {
        return 0;
    }
    return taxes[stateName] + itemTypeTaxModifier[stateName];
}

//############################
//Production - код:
//production();

//############################
//Тесты:
var tests = [
    () => assertEquals(3.0 * (1 + 0.04), calculatePriceFor("Alabama", "eggs")),
    () => assertEquals(0.4 * (1 + 0.015 + 0.065), calculatePriceFor("Arkansas", "coca-cola")),
    () => assertEquals(6.7 * (1 + 0.0), calculatePriceFor("Alaska", "amoxicillin")),
    () => assertEquals(6.7 * (1 + 0.0), calculatePriceFor("California", "amoxicillin")),
    () => assertEquals(2 * (1 + 0.0635), calculatePriceFor("Connecticut", "hamburger")),
];
//Раскомментируйте следующую строчку для запуска тестов:
runTests (tests);

//############################
//Код ниже этой строчки не надо менять для выполнения домашней работы

function production(){
    var calculator = new TaxCalculator();
    calculator.calculateTax();
}

function getSelectedItem(){
    var items = ["milk", "eggs", "coca-cola", "amoxicillin", "aspirin", "marijuana", "hamburger", "ceasar salad"];
    return items[Math.floor(Math.random() * items.length)];
}

function getSelectedState(){
    var state = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut"];
    return state[Math.floor(Math.random() * state.length)];
}

function getOrdersCount(){
    return Math.floor(Math.random() * 3) + 1;
}

//############################
// Кустарный способ писать тесты

function assertEquals (expected, actual) {
    var epsilon = 0.000001;
    var difference = Math.abs(expected - actual);
    if ( difference > epsilon || difference === undefined || isNaN(difference)) {
        console.log(`Fail! Expected: ${expected}, Actual: ${actual}` );
        return -1;
    }
    return 0;
}

function runTests (tests) {
    var failedTests = tests
        .map((f) => f())
        .map((code) => {if (code === -1) {return 1} else {return 0}})
        .reduce((a, b) => a + b, 0);

    if (failedTests === 0) {
        console.log(`Success: ${tests.length} tests pass`);
    }
    else {
        console.log(`Fail: ${failedTests} tests failed`);
    }
}

