import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { hi5 } from '../../../../aparte/aparte.builder';
import {
  API_KEY_FREQUENCE,
  enumFromString,
  TAB_NAMES,
} from '../../../../ressources/enums';
import { icons } from '../../../../ressources/icons';
import { AutomationT, CSVConfigT } from '../../../../ressources/types';
import {
  DialogNavigationService,
  DialogState,
} from '../../../services/dialog-navigation.service';
import { EventService } from '../../../services/event.service';
import { SessionReaderHelperService } from '../../../services/session-reader-helper.service';
import {
  SESSION_KEYS,
  SessionService,
} from '../../../services/session.service';
import { CsvRootDialogComponent } from '../csv-root-dialog/csv-root-dialog.component';

@Component({
  selector: 'app-config-csvdialog',
  templateUrl: './config-csvdialog.component.html',
  styleUrl: './config-csvdialog.component.scss',
})
export class ConfigCSVDialogComponent
  extends CsvRootDialogComponent
  implements OnInit, AfterViewInit
{
  configForm!: FormGroup;
  icons = icons;
  private _pickedTab: TAB_NAMES = TAB_NAMES.TRANSLATORS;
  private _sysAutomations: string[] = [];
  private _customAutmations: string[] = [];
  private _pickedAutomations: string[] = [];

  get pickedTab() {
    return this._pickedTab;
  }

  get specificOptions() {
    return this._customAutmations;
  }

  get systemOptions() {
    return this._sysAutomations;
  }

  isTabSelected(tabName: string) {
    return this._pickedTab.toString() == tabName;
  }

  constructor(
    @Inject(FormBuilder) protected fb: FormBuilder,
    private sessionServ: SessionService,
    private sessionHelper: SessionReaderHelperService,
    protected override events: EventService,
    protected override navService: DialogNavigationService
  ) {
    super(events, navService);
  }
  ngAfterViewInit(): void {
    this.subscribe(
      this.sessionServ.getSess(SESSION_KEYS.TRANSLATIONS).subscribe((data) => {
        const config = this.sessionHelper.putTranslationsSession(data);
        const automationList: AutomationT[] = config.automations.list;
        this.delayedBroadcast(hi5({ APPLY_FILTERS: 'ui.component.form' }), {
          automations: config.automations.picked || [],
        });

        automationList.forEach((aut) => {
          if (aut.isSystem) {
            this._sysAutomations.push(aut.column);
          } else {
            this._customAutmations.push(aut.column);
          }
        });
      })
    );

    setTimeout(() => {
      this.configForm.patchValue({
        reuse: API_KEY_FREQUENCE.ONCE,
      });
    }, 500);
  }

  ngOnInit(): void {
    const model = {
      reuse: [],
      automations: [[]],
    };
    this.configForm = this.fb.group(model);
    this.listenDoing({ PICK: 'ui.component.nav.tabs' }, (data: string) => {
      this._pickedTab =
        enumFromString(TAB_NAMES, data) || TAB_NAMES.TRANSLATORS;
    });

    this.listenDoing({ PATCH_FILTERS: 'data' }, (data) => {
      this._pickedAutomations = data.automations;
    });
  }

  override getState(): DialogState {
    return DialogState.CONFIG;
  }

  applyConfig() {
    this.subscribe(
      this.sessionServ.getSess(SESSION_KEYS.TRANSLATIONS).subscribe((data) => {
        const config: CSVConfigT = data as any;
        config.automations.picked = this._pickedAutomations;
        this.sessionServ.setSess(SESSION_KEYS.TRANSLATIONS, config);
        this.go.toCreate();
      })
    );
  }
}
