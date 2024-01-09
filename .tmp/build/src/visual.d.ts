import "datatables.net";
import "datatables.net/js/jquery.dataTables.min.js";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import powerbi from "powerbi-visuals-api";
import "../style/visual.less";
export declare class Visual implements IVisual {
    private host;
    private target;
    private updateCount;
    private textNode;
    private formattingSettings;
    private formattingSettingsService;
    private reactRoot;
    private dataTable;
    constructor(options: VisualConstructorOptions);
    update(options: VisualUpdateOptions): void;
    getFormattingModel(): powerbi.visuals.FormattingModel;
}
