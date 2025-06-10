import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map, Subscription, takeWhile, tap, timer } from 'rxjs';
import { pinch } from '../../../../aparte/aparte.builder';
import { encryptData } from '../../../../lib/mycrypto';
import { API_KEY_FREQUENCE, TAB_NAMES } from '../../../../ressources/enums';
import { icons } from '../../../../ressources/icons';
import {
  dateDifferenceInSeconds,
  getUTCDate,
  isThatDay,
} from '../../../../ressources/string';
import { CSVConfigT, Lang } from '../../../../ressources/types';
import { ApiKeyService } from '../../../services/api-key.service';
import {
  DialogNavigationService,
  DialogState,
} from '../../../services/dialog-navigation.service';
import { EventService } from '../../../services/event.service';
import { SecurityService } from '../../../services/security.service';
import { SessionReaderHelperService } from '../../../services/session-reader-helper.service';
import {
  SESSION_KEYS,
  SessionService,
} from '../../../services/session.service';
import { CsvRootDialogComponent } from '../csv-root-dialog/csv-root-dialog.component';
import { getApiKeyParts } from './apiKeyHelper';

import { TranslationService } from '../../../services/translation.service';
import { geTtargets } from '../../../../lib/translationsHelper';



type ConfigFormValuesT = {
  keyName: string;
  key: string;
  reuse: string;
  test: string;
  dateReuse: Date;
  target: string;
};

const MAX_TEST_COUNT = 100;

@Component({
  selector: 'app-config-apikey-csvdialog',
  templateUrl: './config-apikey-csvdialog.component.html',
  styleUrl: './config-apikey-csvdialog.component.scss',
})
export class ConfigAPIKeyCSVDialogComponent extends CsvRootDialogComponent {
  private _finishedCountDown: boolean = false;
  discreetKey: any;
  private _fullProvisoryrKey: any;
  private _isKeyPersisted: boolean;
  private _targets: Lang[] = [];
  private _testCharacterCount = 0;
  private _testResult: string = '';

  get testCharacterCount() {
    return this._testCharacterCount;
  }

  get testResult() {
    return this._testResult;
  }

  get testCharacterMax() {
    return MAX_TEST_COUNT;
  }

  get isFinishCountDown() {
    return this._finishedCountDown;
  }
  set isFinishCountDown(value: boolean) {
    this._finishedCountDown = value;
  }

  get persistingKeyClass() {
    return { 'saved-key': this._isKeyPersisted };
  }

  get isPersistedKey() {
    return this._isKeyPersisted;
  }

  get targets() {
    return this._targets;
  }

  isCharacterValid() {
    return (
      this._testCharacterCount > MAX_TEST_COUNT || this._testCharacterCount == 0
    );
  }

  removeKeyAfterDateReached() {
    const dateReuse: Date = this.configForm
      ? new Date(this.configForm.get('dateReuse')?.value)
      : getUTCDate();
    let now = getUTCDate();
    console.log(dateReuse);
    let tomorrowMidnight = new Date(
      Date.UTC(
        dateReuse.getUTCFullYear(),
        dateReuse.getUTCMonth(),
        dateReuse.getUTCDate() + 1
      )
    );

    const seconds = dateDifferenceInSeconds(now, tomorrowMidnight);
    return this.setCountDown(seconds, (n) => {
      if (n == 0 && this.isKeyForTheDay) {
        this.configForm.patchValue({ key: '' });
        this.isFinishCountDown = false;
      }
    });
  }
  setCountDown(seconds: number, cb: (n: number) => void) {
    return timer(0, 1000).pipe(
      map((n) => (seconds - n) * 1000),
      takeWhile((n) => n >= 0),
      tap(cb)
    );
  }
  icons = icons;
  configForm!: FormGroup;
  secondsRemaining$ = this.removeKeyAfterDateReached();

  private _inputedName = '';

  constructor(
    private fb: FormBuilder,
    private sessionServ: SessionService,
    private sessionHelper: SessionReaderHelperService,
    private security: SecurityService,
    private translation: TranslationService,
    private keys: ApiKeyService,
    protected override events: EventService,
    navService: DialogNavigationService
  ) {
    super(events, navService);

    this._targets = geTtargets();
    const model = {
      keyName: [''],
      key: [''],
      reuse: [''],
      dateReuse: [null],
      test: [''],
      target: [this._targets.find((x) => x.code == 'EN-GB')?.code],
    };
    this.configForm = this.fb.group(model);
    this._isKeyPersisted = false;
  }
  override getState(): DialogState {
    return DialogState.CONFIG_AUTOMATION;
  }

  getCountDown() {}

  ngAfterViewInit(): void {
    this.subscribe(
      this.sessionServ.getSess(SESSION_KEYS.TRANSLATIONS).subscribe((data) => {
        this.removeKeyWhenOutdated(this.patchConfigFromSession(data));
      }),
      this.configForm.valueChanges.subscribe((event) => {
        setTimeout(() => {
          const key = this.configForm.get('key')?.value;
          const { segments } = getApiKeyParts(key);

          if (
            !this._inputedName &&
            this.configForm.get('keyName')?.value != segments[0]
          ) {
            this.configForm.patchValue({ keyName: segments[0] });
          }
        }, 100);
        this._testCharacterCount = (
          this.configForm.get('test')?.value || ''
        ).length;
      })
    );
    this.changeKeyPersistingStatus();
  }

  changeKeyPersistingStatus() {
    let isPersistedSubscription: any;
    isPersistedSubscription = this.keys.getKey().subscribe((data: any) => {
      this._isKeyPersisted = !!data;
      isPersistedSubscription.unsubscribe();
    });
  }

  onFocusKey() {
    if (this._fullProvisoryrKey) {
      this.configForm.patchValue(
        { key: this._fullProvisoryrKey },
        {
          emitEvent: false,
        }
      );
    }
  }
  onLostFocusKey() {
    const key = this.configForm.get('key')?.value;
    this._fullProvisoryrKey = key;

    setTimeout(() => {
      const { segments } = getApiKeyParts(key);
      this.discreetKey = segments[0];
      this.configForm.patchValue(
        { key: this.discreetKey },
        {
          emitEvent: false,
        }
      );
    }, 500);
  }

  patchConfigFromSession(data: any): { uses: any; dateReuse: any } {
    let {
      name: keyName,
      uses,
      key,
      dateReuse,
    } = this.sessionHelper.putTranslationsSession(data).translators;

    this._inputedName = key || '';
    this.configForm.patchValue({
      keyName,
      key,
      reuse: uses || API_KEY_FREQUENCE.ONCE,
      dateReuse,
    });
    return { uses, dateReuse };
  }

  get isKeyForTheDay() {
    const uses = this.configForm.get('reuse')?.value;
    return uses == API_KEY_FREQUENCE.FOR_THE_DAY;
  }

  get isKeyForSingleUse() {
    const uses = this.configForm.get('reuse')?.value;
    return uses == API_KEY_FREQUENCE.ONCE;
  }

  get isKeyForEveryUses() {
    const uses = this.configForm.get('reuse')?.value;
    return uses == API_KEY_FREQUENCE.EVERITHIME;
  }

  removeKeyWhenOutdated(config: any) {
    let { uses, dateReuse } = config;
    if (uses == API_KEY_FREQUENCE.FOR_THE_DAY) {
      // dateReuse = new Date('2025-05-10T02:01:56.347Z');
      if (dateReuse && !isThatDay(dateReuse)) {
        this.configForm.patchValue({ key: '' });
      }
    }
    this.applyConfig(false);
  }

  inputedKeyName(event: any) {
    this._inputedName = event.target.value;
  }

  applyConfig(navigate: boolean) {
    this.subscribe(
      this.sessionServ.getSess(SESSION_KEYS.TRANSLATIONS).subscribe((data) => {
        let {
          keyName: name,
          reuse: uses,
          key,
          dateReuse,
        } = this.configForm.getRawValue();

        if (true || !isThatDay(dateReuse)) {
          dateReuse = getUTCDate();
        }
        const config: CSVConfigT = data as any;
        config.translators = { key, name, uses, dateReuse };
        this.sessionServ.setSess(SESSION_KEYS.TRANSLATIONS, config);
      })
    );
  }

  async upDateKey() {
    let updateSubscription: Subscription;
    const key = this._fullProvisoryrKey;

    encryptData(key).then((data) => {
      updateSubscription = this.keys.update(data).subscribe(() => {
        this._isKeyPersisted = true;
        updateSubscription.unsubscribe();
      });
    });
  }

  getTargetLanguage() {
    const { lang, variant } = /^(?<lang>.+-|)(?<variant>.+)$/.exec(
      this.configForm.get('target')?.value
    )!.groups || { lang: 'EN-', variant: 'GB' };

    return `${lang.toLowerCase()}${variant}`;
  }
  testKey() {
    let testSubscription: Subscription;
    const { reuse, test, key, keyName }: ConfigFormValuesT =
      this.configForm.getRawValue();
    testSubscription = this.translation
      .testTranslation(test, `:${this.getTargetLanguage()}`)
      .subscribe((data: any) => {
        this._testResult = data.text;
        testSubscription.unsubscribe();
      });

    if (reuse == API_KEY_FREQUENCE.ONCE) {
      if (keyName == key) {
        this._inputedName = keyName;
        this.configForm.patchValue({ keyName });
      }
      this.configForm.patchValue({ key: null });
      this.deleteKey();
      this.applyConfig(false);
    }
  }

  deleteKey() {
    let deleteKeySub: any;
    deleteKeySub = this.keys.deleteKey().subscribe(() => {
      this._isKeyPersisted = false;
      this.changeKeyPersistingStatus();
      deleteKeySub.unsubscribe();
    });
  }

  goBack() {
    this.broadcast(pinch({ NAVIGATE: 'ui.dialog' }), DialogState.CONFIG);
    setTimeout(() => {
      this.broadcast(
        pinch({ PICK: 'ui.component.nav.tabs' }),
        TAB_NAMES.TRANSLATORS
      );
    }, 100);
  }
}
