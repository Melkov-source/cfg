import {Root} from "./elements/root.js";
import {Q_TYPE, VisualElement} from "./elements/visual-element.js";
import {Label} from "./elements/label.js";
import {TextField} from "./elements/text-field.js";
import {CheckBox} from "./elements/check-box.js";
import {Button} from "./elements/button.js";

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
            "FieldType": 6,
            "FirstElementFieldType": 6,
            "LinkContractHash": 1905846514
          },
          {
            "Name": "TestField5",
            "Description": "Number 2 for example!",
            "FieldType": 6,
            "FirstElementFieldType": 6,
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
        "FieldType": 5,
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
        "FieldType": 6,
        "FirstElementFieldType": 6,
        "LinkContractHash": -1318635350
      },
      {
        "Name": "Test",
        "Description": null,
        "FieldType": 6,
        "FirstElementFieldType": 6,
        "LinkContractHash": 1905846514
      },
      {
        "Name": "Container",
        "Description": null,
        "FieldType": 4,
        "FirstElementFieldType": 6,
        "LinkContractHash": 1905846514
      }
    ]
  }`;

interface ICFGConfigMetaInfo extends ICFGContractMetaInfo {
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
    BOOLEAN = 5,
    OBJECT = 6
}

const config_meta: ICFGConfigMetaInfo = JSON.parse(json);


const root = new Root();

/*root.Q<Button>("send-button", Q_TYPE.ID, Button)?.onClick(() => {

});*/

const content = root.Q<VisualElement>("scene-content", Q_TYPE.CLASS, VisualElement)!;

const draw_contract = (contract: ICFGContractMetaInfo, content_to: VisualElement, draw_name: boolean = true) => {
    const container = VisualElement.Div();
    container.setParent(content_to!);
    container.setStyle({
        margin: "10px 0 10px 5px",
        width: "auto"
    })

    if(draw_name) {
        const title_label = Label.Create();
        title_label.setParent(container);
        title_label.setText(contract.Name);
        title_label.setStyle({
            color: "#FFFFFF",
            fontWeight: "bold"
        })
    }


    const members_container = VisualElement.Div();
    members_container.setParent(container);
    members_container.setStyle({
        background: "rgba(0,0,0,0.21)",
        width: "auto",
        padding: "5px",
    });

    for (const member of contract.Members) {
        const member_view = create_view_member(member);

        member_view?.setStyle({
            marginBottom: "10px"
        })

        if(!member_view) {
            const error_label = Label.Create();
            error_label.setParent(members_container);

            const type = Object.keys(CFG_MEMBER_TYPE).find(key => (CFG_MEMBER_TYPE as any)[key] === member.FieldType);

            error_label.setText(`Error: field: ${type}, member: ${member.Name}`);
            error_label.setStyle({
                color: "#ff0000"
            })
            continue;
        }

        member_view.setParent(members_container);
    }

}

export class KeyValueTextField extends VisualElement {
    public constructor(key: string) {
        const div = VisualElement.Div();

        div.setStyle({
            display: "flex",
            justifyContent: "space-between", // Расположение элементов по краям
            alignItems: "center", // Вертикальное выравнивание по центру
            padding: "5px", // Отступы для лучшего восприятия
        });

        const label = Label.Create();
        label.setParent(div);
        label.setText(key);

        label.setStyle({
            color: "#FFFFFF",
            fontWeight: "bold",
            marginRight: "10px", // Отступ между меткой и полем ввода
        });

        const input = TextField.Create();
        input.setParent(div);

        super(div.root);
    }
}

export class KeyValueCheckbox extends VisualElement {
    public constructor(key: string) {
        const div = VisualElement.Div();

        div.setStyle({
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "5px",
        });

        const label = Label.Create();
        label.setParent(div);
        label.setText(key);

        label.setStyle({
            color: "#FFFFFF",
            fontWeight: "bold",
            marginRight: "10px",
        });

        const input = CheckBox.Create();
        input.setParent(div);

        super(div.root);
    }
}

export class KeyValueObject extends VisualElement {
    public readonly container: VisualElement;

    public constructor(key: string) {
        const div = VisualElement.Div();

        div.setStyle({
            display: "flex",
            justifyContent: "space-between",
            alignItems: "top",
            padding: "5px",
        });

        const label = Label.Create();
        label.setParent(div);
        label.setText(key);

        label.setStyle({
            color: "#FFFFFF",
            fontWeight: "bold",
            marginRight: "10px",
        });

        super(div.root);

        this.container = VisualElement.Div();
        this.container.setParent(div);
    }
}


const create_view_member = (member: ICFGMemberMetaInfo): VisualElement | undefined => {
    switch (member.FieldType) {
        case CFG_MEMBER_TYPE.STRING:
        case CFG_MEMBER_TYPE.NUMBER_INTEGER:
        case CFG_MEMBER_TYPE.NUMBER:
            const keyValue = new KeyValueTextField(member.Name);
            keyValue.setStyle({
                justifyContent: "space-between",
                display: "flex",
            });
            return keyValue;

        case CFG_MEMBER_TYPE.BOOLEAN:
            const keyValueCheckbox = new KeyValueCheckbox(member.Name);
            keyValueCheckbox.setStyle({
                justifyContent: "space-between",
                display: "flex",
            });
            return keyValueCheckbox;

        case CFG_MEMBER_TYPE.OBJECT:
            const t = new KeyValueObject(member.Name);
            const contract = config_meta.Contracts.find(c => c.Hash === member.LinkContractHash)!;
            draw_contract(contract, t.container, false);
            return t;

        case CFG_MEMBER_TYPE.ARRAY_OR_LIST:
            const arrayDiv = VisualElement.Div();

            arrayDiv.setStyle({
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "5px",
            });

            const headerLabel = Label.Create();
            headerLabel.setParent(arrayDiv);
            headerLabel.setText(`${member.Name} (0)`); // Показать количество элементов (пока 0)

            headerLabel.setStyle({
                color: "#FFFFFF",
                fontWeight: "bold",
                marginRight: "10px",
            });

            const addButton = Button.Create("+");
            addButton.setParent(arrayDiv);
            addButton.setStyle({
                marginLeft: "10px",
            });

            addButton.onClick(() => {
                
            });

            return arrayDiv;

        case CFG_MEMBER_TYPE.NONE:
        default:
            break;
    }

    return undefined;
};



draw_contract(config_meta, content);
draw_contract(config_meta, content);
draw_contract(config_meta, content);
draw_contract(config_meta, content);
draw_contract(config_meta, content);
draw_contract(config_meta, content);





