import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { pinch } from '../../../../aparte/aparte.builder';
import { fileSize } from '../../../../lib/filesHelper';
import { geTtargets } from '../../../../lib/translationsHelper';
import { API_KEY_FREQUENCE } from '../../../../ressources/enums';
import { icons } from '../../../../ressources/icons';
import { DynamicObject, Lang } from '../../../../ressources/types';
import { ApiKeyService } from '../../../services/api-key.service';
import {
  DialogNavigationService,
  DialogState,
} from '../../../services/dialog-navigation.service';
import { EventService } from '../../../services/event.service';
import { LoremIpsumService } from '../../../services/loremIpsum.service';
import { SessionReaderHelperService } from '../../../services/session-reader-helper.service';
import {
  SESSION_KEYS,
  SessionService,
} from '../../../services/session.service';
import { TranslationService } from '../../../services/translation.service';
import { CsvRootDialogComponent } from '../csv-root-dialog/csv-root-dialog.component';

const DIRECTION = 'nl:FR';
const MAX_TEST_COUNT = 2000;

@Component({
  selector: 'app-create-csvdialog',
  templateUrl: './create-csvdialog.component.html',
  styleUrl: './create-csvdialog.component.scss',
})
export class CreateCSVDialogComponent
  extends CsvRootDialogComponent
  implements OnInit, AfterViewInit
{
  icons = icons;
  configForm!: FormGroup;

  private _translationDirection = 'nl:fr';
  private _targets: Lang[] = [];
  private _uses: any;
  private _loremPlaceholder: any;
  private _fileIcon = 'assets/images/vecteezy/xls.png';
  private _textContent = `dutch;french;type;article;theme
Bij een grote Oekraïense drone-aanval op verschillende Russische luchtmachtbasissen zijn wellicht 13 strategische bommenwerpers vernietigd en nog een paar andere baschadigd.;Une importante attaque de drones ukrainiens contre plusieurs bases aériennes russes pourrait avoir détruit 13 bombardiers stratégiques et endommagé quelques autres bases.;sentence;;Eten & Drinken
Nog nooit sloeg het Oekraïense leger zo ver van het front toe: één aanval reikte zelfs tot in Siberië;Jamais auparavant l'armée ukrainienne n'avait frappé aussi loin du front : une attaque a atteint la Sibérie;words;;Eten & Drinken
helemaal in het oosten van Rusland.;jusqu'à l'est de la Russie.;words;;Eten & Drinken
Bovendien lijkt er een complexe logistieke operatie aan vooraf te zijn gegaan.;De plus, une opération logistique complexe semble l'avoir précédée.;sentence;;Eten & Drinken
Zo verliep operatie 'Spinnenweb'.;Voici comment s'est déroulée l'opération "Toile d'araignée".;sentence;;Eten & Drinken`;
  private _file?: File = undefined;
  private _fileInfos = { name: '', size: '' };
  private _isKeyPersisted = false;
  private _baseTextCount = 0;

  get isFileGenerated() {
    return this._file;
  }
  get fileIcon() {
    return this._fileIcon;
  }

  get baseTextCount() {
    return this._baseTextCount;
  }

  get isPersistedKey() {
    return this._isKeyPersisted;
  }
  get fileInfos() {
    return this._fileInfos;
  }

  get loremPlaceholder() {
    return this._loremPlaceholder;
  }

  get translationDirection() {
    return this._translationDirection;
  }

  get isTranslationDisabled() {
    return !this.isPersistedKey || this.isCharacterInvalid();
  }
  get uses() {
    return this._uses;
  }

  get testCharacterMax() {
    return MAX_TEST_COUNT;
  }

  get apiKeyName() {
    return this.configForm ? this.configForm.get('keyName')?.value : '';
  }
  constructor(
    @Inject(FormBuilder) protected fb: FormBuilder,
    protected override events: EventService,
    private sessionServ: SessionService,
    private translation: TranslationService,
    private sessionHelper: SessionReaderHelperService,
    private loremServ: LoremIpsumService,
    private keys: ApiKeyService,
    protected override navService: DialogNavigationService
  ) {
    super(events, navService);
    this._loremPlaceholder = loremServ.lorem().generateSentences();
  }

  isCharacterInvalid() {
    return this._baseTextCount > MAX_TEST_COUNT || this._baseTextCount == 0;
  }

  changeKeyPersistingStatus() {
    let isPersistedSubscription: any;
    isPersistedSubscription = this.keys.getKey().subscribe((data: any) => {
      this._isKeyPersisted = !!data;
      isPersistedSubscription.unsubscribe();
    });
  }

  ngAfterViewInit(): void {
    this.subscribe(
      this.sessionServ.getSess(SESSION_KEYS.TRANSLATIONS).subscribe((data) => {
        //console.log(data);
        const { uses, dateReuse } = this.patchConfigFromSession(data);
        this._uses = uses;
      })
    );
    this.changeKeyPersistingStatus();
  }
  ngOnInit(): void {
    this._targets = geTtargets();
    const model = {
      picked: [[]],
      automations: [[]],
      keyName: [''],
      key: [''],
      reuse: [''],
      dateReuse: [null],
      baseText: [''],
      target: [this._targets.find((x) => x.code == 'EN-GB')?.code],
    };
    this.configForm = this.fb.group(model);
    this.configForm.valueChanges.subscribe(() => {
      this._baseTextCount = (
        this.configForm.get('baseText')?.value || ''
      ).length;
    });
  }

  patchConfigFromSession(data: any): {
    uses: any;
    dateReuse: any;
    automations: { column: string; regex: string }[];
    picked: string[];
  } {
    let {
      name: keyName,
      uses,
      key,
      dateReuse,
      list: automations,
      picked,
    } = {
      ...this.sessionHelper.putTranslationsSession(data).translators,
      ...this.sessionHelper.putTranslationsSession(data).automations,
    };

    this.configForm.patchValue({
      automations,
      picked,
      keyName,
      key,
      reuse: uses || API_KEY_FREQUENCE.ONCE,
      dateReuse,
    });
    return { uses, dateReuse, picked, automations };
  }

  onLoadFile() {
    this.go.toFile();
    setTimeout(() => {
      this.broadcast(pinch({ FILE: 'data.download' }), this._textContent);
    }, 100);
  }

  generate() {
    const { automations, baseText: text } = this.configForm.getRawValue();

    const params: DynamicObject = { direction: DIRECTION };
    automations.forEach((param: { column: string; regex: string }) => {
      params[param.column] = encodeURI(param.regex);
    });

    let translationSub: Subscription;
    translationSub = this.translation
      .submitForTranslation(text, params)
      .subscribe((data) => {
        this._textContent = (data as any).csv;
        //console.log(this._textContent);
        this.loadInfoFromReadContent(this._textContent);
        translationSub.unsubscribe();
      });
  }

  loadInfoFromReadContent(data: string) {
    const blob = new Blob([data], { type: 'text/plain' });
    this._file = new File([blob], 'foo.txt', { type: 'text/plain' });

    this._file?.text().then((data) => {
      this._fileInfos = {
        size: fileSize(data),
        name: this._file?.name || '0kb',
      };
    });
  }

  clearFile() {
    this._file = undefined;
    this.configForm.patchValue({ baseText: '' });
  }

  override getState(): DialogState {
    return DialogState.CREATE;
  }
}
