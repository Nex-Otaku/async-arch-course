const environment = require('./../Env/environment');
const inquirer = environment.require('inquirer');
const clear = environment.require('clear');
const chalk = environment.require('chalk');
const figlet = environment.require('figlet');
const pressAnyKey = environment.require('press-any-key');

const newline = () => {
    console.log();
}

const keypress = async () => {
    console.log();
    return pressAnyKey('Нажмите любую клавишу...');
}

const printHeader = async (title) => {
    clear();
    console.log(
        chalk.yellow(
            figlet.textSync(title, { horizontalLayout: 'full' })
        )
    );

    newline();
};

const inputRequired = async (label, defaultValue) => {
    return (await inquirer.prompt({
        name: 'myInput',
        type: 'input',
        message: label,
        default: defaultValue ?? null,
        validate: function( value ) {
            if (value.length) {
                return true;
            } else {
                return 'Поле обязательно для заполнения';
            }
        }
    })).myInput;
};


const selectAction = async (actions) => {
    let results = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Выберите команду',
            choices: actions,
            pageSize: 50
        }
    ]);

    newline();

    return results.action;
};

const selectWithCancel = async (prompt, options) => {

    const optionsCopy = [].concat(options);
    optionsCopy.push(' -- отмена');

    const result = await inquirer.prompt([
        {
            type: 'list',
            name: 'myInput',
            message: prompt,
            choices: optionsCopy,
            pageSize: 30,
        }
    ]);

    if (result.myInput === ' -- отмена') {
        return '';
    }

    return result.myInput;
}

const separator = () => {
    return new inquirer.Separator();
}

module.exports = {
    printHeader: printHeader,
    selectAction: selectAction,
    selectWithCancel: selectWithCancel,
    keypress: keypress,
    separator: separator,
    inputRequired: inputRequired
}