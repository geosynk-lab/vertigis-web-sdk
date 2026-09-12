import type { LibraryRegistry } from "@vertigis/web/config";
import CustomWidget, { CustomWidgetModel } from "./components/CustomWidget";

const LAYOUT_NAMESPACE = "custom.foo";

export default function (registry: LibraryRegistry): void {
    registry.registerComponent({
        category: "map",
        iconId: "widgets",
        name: "custom-widget",
        namespace: LAYOUT_NAMESPACE,
        getComponentType: () => CustomWidget,
        itemType: "custom-widget-model",
        title: "Custom Widget",
    });
    registry.registerModel({
        getModel: config => new CustomWidgetModel(config),
        itemType: "custom-widget-model",
    });
}
