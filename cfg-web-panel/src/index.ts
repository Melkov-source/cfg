import {Root} from "./elements/root.js";
import {Q_TYPE, VisualElement} from "./elements/visual-element.js";
import {Label} from "./elements/label.js";
import {TextField} from "./elements/text-field.js";

/*const ip: string = "127.0.0.1";
const port: number = 8080;

const host = `ws://${ip}:${port}/test`;

const client = new Client(host);

client.connect();*/

const json = `
  {
    "Group": "Test",
    "Contracts": [
      {
        "Hash": 1905846514,
        "Name": "TestNew",
        "Description": null,
        "Members": [
          {
            "Name": "Number2",
            "Description": "Number 2 for example!",
            "FieldType": 2,
            "FirstElementFieldType": 0,
            "LinkContractHash": 0
          }
        ]
      },
      {
        "Hash": -1318635350,
        "Name": "TestNew",
        "Description": null,
        "Members": [
          {
            "Name": "TestField",
            "Description": "Number 2 for example!",
            "FieldType": 4,
            "FirstElementFieldType": 7,
            "LinkContractHash": 1905846514
          },
          {
            "Name": "TestField1",
            "Description": "Number 2 for example!",
            "FieldType": 3,
            "FirstElementFieldType": 0,
            "LinkContractHash": 0
          },
          {
            "Name": "TestField2",
            "Description": "Number 2 for example!",
            "FieldType": 2,
            "FirstElementFieldType": 0,
            "LinkContractHash": 0
          },
          {
            "Name": "TestField3",
            "Description": "Number 2 for example!",
            "FieldType": 1,
            "FirstElementFieldType": 0,
            "LinkContractHash": 0
          },
          {
            "Name": "TestField4",
            "Description": "Number 2 for example!",
            "FieldType": 7,
            "FirstElementFieldType": 7,
            "LinkContractHash": 1905846514
          },
          {
            "Name": "TestField5",
            "Description": "Number 2 for example!",
            "FieldType": 7,
            "FirstElementFieldType": 7,
            "LinkContractHash": 1905846514
          }
        ]
      }
    ],
    "Hash": -2096018820,
    "Name": "TestCFG",
    "Description": "Testing cfg...",
    "Members": [
      {
        "Name": "Number",
        "Description": "This is simple number",
        "FieldType": 2,
        "FirstElementFieldType": 0,
        "LinkContractHash": 0
      },
      {
        "Name": "Text",
        "Description": null,
        "FieldType": 1,
        "FirstElementFieldType": 0,
        "LinkContractHash": 0
      },
      {
        "Name": "Boolean Value",
        "Description": null,
        "FieldType": 6,
        "FirstElementFieldType": 0,
        "LinkContractHash": 0
      },
      {
        "Name": "Test2",
        "Description": null,
        "FieldType": 4,
        "FirstElementFieldType": 2,
        "LinkContractHash": 0
      },
      {
        "Name": "Popf Vasya",
        "Description": null,
        "FieldType": 7,
        "FirstElementFieldType": 7,
        "LinkContractHash": -1318635350
      },
      {
        "Name": "Test",
        "Description": null,
        "FieldType": 7,
        "FirstElementFieldType": 7,
        "LinkContractHash": 1905846514
      },
      {
        "Name": "Container",
        "Description": null,
        "FieldType": 4,
        "FirstElementFieldType": 7,
        "LinkContractHash": 1905846514
      }
    ]
  }`;

interface ICFGConfigMetaInfo {
    Group: string,
    Contracts: ICFGContractMetaInfo[]
}

interface ICFGContractMetaInfo {
    Hash: number,
    Name: string,
    Description: string,
    Members: ICFGMemberMetaInfo[]
}

interface ICFGMemberMetaInfo {
    Name: string,
    Description: string,
    FieldType: CFG_MEMBER_TYPE,
    FirstElementFieldType: CFG_MEMBER_TYPE,
    LinkContractHash: number,
}

enum CFG_MEMBER_TYPE {
    NONE = 0,
    STRING = 1,
    NUMBER_INTEGER = 2,
    NUMBER = 3,
    ARRAY_OR_LIST = 4,
    BOOLEAN = 6,
    OBJECT = 7
}

const config_meta: ICFGConfigMetaInfo = JSON.parse(json);


const root = new Root();

/*root.Q<Button>("send-button", Q_TYPE.ID, Button)?.onClick(() => {

});*/

const content = root.Q<VisualElement>("scene-content", Q_TYPE.CLASS, VisualElement);

const func_resolve_object = (object: any) => {
    const keys = Object.keys(object);

    const container = VisualElement.Div();

    container.setParent(content!);

    for (const key of keys) {
        const value = object[key];

        const keyValue = new KeyValue(key, value);

        keyValue.setParent(container!);
        keyValue.setStyle({
            justifyContent: "space-between",
            display: "flex"
        });
    }
}

export class KeyValue extends VisualElement {
    public constructor(key: string, value: string | number | boolean) {
        const div = VisualElement.Div();

        div.setStyle({
            display: "flex"
        })

        const label = Label.Create();
        label.setParent(div);
        label.setText(key);

        label.setStyle({
            color: "#FFFFFF",
            fontWeight: "bold",
            margin: "5px",
        })

        const input = TextField.Create();
        input.setParent(div);
        input.setValue(value.toString());


        super(div.root);
    }
}

func_resolve_object(config_meta);





