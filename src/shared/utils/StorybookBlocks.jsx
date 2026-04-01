import React from "react";

/*
    Syntax:

    <uStorybookBlockTable 
        columns={["SCSS variable", "Value"]} 
        list={Document.documentVariables}
    />
*/
export const uStorybookBlockTable = ({list, columns}) => (
    <table>
        <thead>
            <tr>
                {columns.map((col) => (
                    <th>{col}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {list.map(([key, value]) => (
            <tr key={key}>
                <td>{key}</td>
                <td>{value}</td>
            </tr>
            ))}
        </tbody>
    </table>
);