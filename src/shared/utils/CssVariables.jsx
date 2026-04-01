/*
    Syntax:

    export const documentVariables = uGetCssVariables('--t-document--')
*/

/* Get all variables --theme--* from css */
export const uGetCssVariables = (prefix) => {
    const result = [];
    for (const sheet of document.styleSheets) {
        for (const rule of sheet.cssRules) {
            if (rule.selectorText !== ":root") continue;
            const cssText = rule.style.cssText;
            const list = cssText.split(";");
            list.forEach(decl => {
                const key_value= decl.split(":").map(s => s && s.trim());
                if (!key_value[0].startsWith(prefix)) return;
                key_value[0] = key_value[0].substring(prefix.length);
                result.push(key_value);
            });
        }
    }
    return result;
};
