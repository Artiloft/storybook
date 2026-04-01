import React from "react";

/*
    Syntax:

*/
export const uStorybookReady = (cb) => {
    if (typeof window !== "undefined" && !window.__myScriptInjected) {
        cb();
    }
};