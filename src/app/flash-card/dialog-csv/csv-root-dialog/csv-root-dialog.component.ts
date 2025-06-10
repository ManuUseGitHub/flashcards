import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';

import {
  DialogNavigationService,
  DialogState,
} from '../../../services/dialog-navigation.service';
import { EventService } from '../../../services/event.service';
import { Subscribing } from '../../../shared/subscribing';

@Component({
  selector: 'app-csv-root-dialog',
  templateUrl: './csv-root-dialog.component.html',
  styleUrl: './csv-root-dialog.component.scss',
})
export abstract class CsvRootDialogComponent extends Subscribing {
  @ViewChild('contentDiv') csvDiv!: ElementRef;
  @ViewChild('inputCSVHeaders') inputCSVHeaders!: ElementRef;
  @ViewChild('inputCSVLines') inputCSVLines!: ElementRef;

  @ViewChild('title', { static: true }) titleTemplate!: TemplateRef<any>;
  @ViewChild('body', { static: true }) bodyTemplate!: TemplateRef<any>;
  @ViewChild('actions', { static: true }) actionsTemplate!: TemplateRef<any>;

  getTemplate() {
    return {
      title: this.titleTemplate,
      body: this.bodyTemplate,
      actions: this.actionsTemplate,
    };
  }

  isOfState(
    name:
      | 'CSV'
      | 'CREATE'
      | 'FILE'
      | 'CONFIG'
      | 'CONFIG_AUTOMATION'
      | 'CONFIG_API_KEY'
  ) {}

  constructor(
    protected override events: EventService,
    protected navService: DialogNavigationService
  ) {
    super(events);
  }

  get go() {
    const from = this.getState();
    return {
      toCSV: () => this.navService.navigate(from, DialogState.CSV),
      toCreate: () => this.navService.navigate(from, DialogState.CREATE),
      toFile: () => this.navService.navigate(from, DialogState.FILE),
      toConfig: () => this.navService.navigate(from, DialogState.CONFIG),
      toConfig_A: () =>
        this.navService.navigate(from, DialogState.CONFIG_AUTOMATION),
      toConfig_B: () =>
        this.navService.navigate(from, DialogState.CONFIG_API_KEY),
      close: () => this.navService.navigate(from, 'close'),
    };
  }
  abstract getState(): DialogState;

  // Example condition placeholder
  private checkCondition1B(): boolean {
    // Implement actual conditional logic
    return true;
  }
}
