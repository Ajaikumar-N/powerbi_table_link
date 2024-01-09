"use strict";
import * as $ from "jquery";
import "datatables.net";
import "datatables.net/js/jquery.dataTables.min.js";
import DataView = powerbi.DataView;
import DataViewTable = powerbi.DataViewTable;
import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import powerbi from "powerbi-visuals-api";
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { VisualFormattingSettingsModel } from "./settings";
import "../style/visual.less";
export class Visual implements IVisual {
  private host: IVisualHost;
  private target: HTMLElement;
  private updateCount: number;
  private textNode: Text;
  private formattingSettings: VisualFormattingSettingsModel;
  private formattingSettingsService: FormattingSettingsService;
  private reactRoot: React.ComponentElement<any, any>;
  private dataTable: DataTables.DataTables; // Use DataTable type from datatables.net namespace
  constructor(options: VisualConstructorOptions) {
    console.log("Visual constructor", options);
    this.host = options.host;
    this.formattingSettingsService = new FormattingSettingsService();
    this.target = options.element;
    this.updateCount = 0;
    this.dataTable = null;
  }
  public update(options: VisualUpdateOptions) {
    this.formattingSettings =
      this.formattingSettingsService.populateFormattingSettingsModel(
        VisualFormattingSettingsModel,
        options.dataViews[0]
      );
    console.log("Visual update", options);
    const dataView: DataView = options.dataViews[0];
    const tableDataView: DataViewTable = dataView.table;
    console.log(dataView);
    if (!tableDataView) {
      return;
    }
    if (this.dataTable) {
      this.dataTable.destroy();
    }
    this.target.textContent = "";
    const container = document.createElement("div");
    const title = document.createElement("h2");
    title.innerText = this.formattingSettings.demoSec.title.value || "Untitled";
    container.appendChild(title);
    const para = document.createElement("p");
    para.innerText = this.formattingSettings.demoSec.subTitle.value || "";
    container.appendChild(para);
    const table = document.createElement("table");
    table.classList.add("simple-table");
    container.appendChild(table);
    this.target.appendChild(container);
    $(document).ready(() => {
      this.dataTable = $(table).DataTable({
        data: tableDataView.rows.map((row) => {
          return tableDataView.columns.reduce((acc, column, index) => {
            acc[column.displayName] = row[index];
            return acc;
          }, {});
        }),
        columns: tableDataView.columns.map(
          (column: DataViewMetadataColumn) => ({
            title: column.displayName,
            data: column.displayName,
          })
        ),
        initComplete: () => {
          $(table).on("click", "td", (event) => {
            const cellData = event.currentTarget.textContent;
            console.log(cellData);
            this.host.launchUrl(cellData);
          });
        },
      });
    });
  }
  public getFormattingModel(): powerbi.visuals.FormattingModel {
    return this.formattingSettingsService.buildFormattingModel(
      this.formattingSettings
    );
  }
}