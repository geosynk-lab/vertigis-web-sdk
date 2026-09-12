import { ComponentModelBase, serializable, importModel } from "@vertigis/web/models";
import type { MapModel } from "@vertigis/web/mapping";

@serializable
export class CustomWidgetModel extends ComponentModelBase {
    @importModel("map-extension")
    map?: MapModel;

    protected override async _onInitialize(): Promise<void> {
        await super._onInitialize();
        this.title = "Custom Widget";
    }
}

export default CustomWidgetModel;
