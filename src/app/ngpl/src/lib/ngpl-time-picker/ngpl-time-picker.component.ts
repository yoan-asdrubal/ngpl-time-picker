/* tslint:disable */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {TemplatePortal} from '@angular/cdk/portal';
import {CdkOverlayOrigin, Overlay, OverlayPositionBuilder, OverlayRef} from '@angular/cdk/overlay';
import {ControlValueAccessor, FormBuilder, FormControl, NG_VALUE_ACCESSOR, NgControl, Validators} from '@angular/forms';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {debounceTime, startWith, take, tap} from 'rxjs/operators';
import {completeFullValueLess10} from 'ngpl-common';
import {timer} from 'rxjs';
import {NGPL_FILTER_BASE, NgplAutofocusDirective, NgplFilterBase} from 'ngpl-filter';

@UntilDestroy()
@Component({
  selector: 'ngpl-time-picker',
  templateUrl: './ngpl-time-picker.component.html',
  styleUrls: ['./ngpl-time-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgplTimePickerComponent),
      multi: true
    },
    {
      provide: NGPL_FILTER_BASE, useExisting: forwardRef(() => NgplTimePickerComponent)
    }
  ]
})
export class NgplTimePickerComponent implements OnInit, OnDestroy, NgplFilterBase, ControlValueAccessor {

  private overlayRef: OverlayRef;
  @ViewChild('templatePortalContent', {static: true}) templatePortalContent: TemplateRef<any>;

  @ViewChild(NgplAutofocusDirective, {static: true}) autofocus: NgplAutofocusDirective;
  @ViewChild(CdkOverlayOrigin, {static: true}) origin: CdkOverlayOrigin;

  valueChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() placeHolder = '';

  @Input() floatLabel = '';

  /**
   * Define el atributo appearance del matFormField, permite los mismos valores
   */
  @Input() appearance: 'legacy' | 'standard' | 'fill' | 'outline' | 'default' = 'outline';

  /**
   * Controla si el componenten debe mostrar un Skeleton
   */
  @Input() showLoading = false;


  @Input() showLoadingWidth = '100%';
  @Input() showLoadingHeight = '15px';

  /**
   * Define si el componente estara deshabilitado
   */
  disabledControl = false;

  @Input() readOnlyControl = false;

  @Input() iconPreffix: string;

  @Input() iconSuffix: string;

  @Input() autocomplete = 'off';

  @Input() hhStep = 1;
  @Input() mmStep = 5;

  timePickerControl = new FormControl();
  timeHHControl = new FormControl(null, [Validators.required, Validators.min(0), Validators.max(23)]);
  timeMMControl = new FormControl(null, [Validators.required, Validators.min(0), Validators.max(59)]);

  ngControl: NgControl;

  constructor(private overlay: Overlay,
              private formB: FormBuilder,
              private injector: Injector,
              private changeDetectorRef: ChangeDetectorRef,
              private overlayPositionBuilder: OverlayPositionBuilder,
              private _viewContainerRef: ViewContainerRef) {

  }


  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null, 2);
    // console.log({'this.ngControl': this.ngControl});

    this.timeHHControl
      .valueChanges
      .pipe(
        untilDestroyed(this),
        startWith(this.timeHHControl.value),
        tap(value => {
          this.calcTimePickerValue();
        })
      )
      .subscribe();
    this.timeMMControl
      .valueChanges
      .pipe(
        untilDestroyed(this),
        startWith(this.timeMMControl.value),
        tap(value => {
          this.calcTimePickerValue();
        })
      )
      .subscribe();

    this.timePickerControl
      .valueChanges
      .pipe(
        // startWith(`${this.autocompleteValueLess10(new Date().getHours())}:${this.autocompleteValueLess10(new Date().getMinutes())}`),
        tap(value => {
          this.onChange(value);
          this.onTouch(value);
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe();

    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.origin.elementRef)
      .withPositions([{
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'top',
        offsetY: 0
      }, {
        originX: 'end',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'top',
        offsetY: 0
      }
      ]);

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      positionStrategy
    });
    this.overlayRef.backdropClick()
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.overlayRef.detach();
      });
  }

  openPanelWithBackdrop(event): void {

    event.stopPropagation();
    event.preventDefault();
    if (this.disabledControl || this.readOnlyControl || !!this.showLoading) {
      return;
    }
    this.overlayRef.attach(new TemplatePortal(
      this.templatePortalContent,
      this._viewContainerRef));
    // console.log('this.autofocus', this.autofocus);
    if (!!this.autofocus) {
      // this.autofocus.onFocus();
    }
  }

  ngOnDestroy(): void {
  }

  onChange: any = () => {
  };
  onTouch: any = () => {
  };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledControl = isDisabled;
  }

  writeValue(obj: string | Date): void {

    if (!obj) {
      this.timeHHControl.setValue(null);
      this.timeMMControl.setValue(null);
      return;
    }
    if (typeof obj === 'string') {
      const values = obj.split(':');
      if (values.length !== 2) {
        throw new Error('Error con valores por defecto para la hora');
      }
      if (+values[0] >= 0 && +values[0] < 24) {
        this.timeHHControl.setValue(completeFullValueLess10(+values[0]));
      }
      if (+values[1] >= 0 && +values[1] < 60) {
        this.timeMMControl.setValue(completeFullValueLess10(+values[1]));
      }
    }
    // setTimeout(() => console.log('writevalue', this.ngControl.control, obj, {
    //   mmValue: this.timeMMControl.value,
    //   mmStatus: this.timeMMControl.status,
    //   hhValue: this.timeHHControl.value,
    //   hhStatus: this.timeHHControl.status
    // }), 10);

    if (this.timeMMControl.invalid || this.timeHHControl.invalid) {

      this.timePickerControl.setValue(null);
      timer()
        .pipe(
          take(1),
          debounceTime(10),
          tap(() => {
            if (!!this.ngControl.control) {
              this.ngControl.control.setValue(null);
            }
            this.changeDetectorRef.markForCheck();
          })
        )
        .subscribe();

    }

  }

  calcTimePickerValue(): void {
    if (this.timeHHControl.valid && this.timeMMControl.valid) {
      this.timePickerControl.setValue(`${completeFullValueLess10(+this.timeHHControl.value)}:${completeFullValueLess10(+this.timeMMControl.value)}`);
    } else {
      this.timePickerControl.setValue(null);
      this.onChange(null);
      this.onTouch(null);
    }
  }


  checkHours(): void {
    const value = this.timeHHControl.value;
    if (value < 0) {
      this.timeHHControl.setValue('00');
    } else if (value > 23) {
      this.timeHHControl.setValue(completeFullValueLess10(value % 23));
    } else if (!value) {
      this.timeHHControl.setValue(null);
    }

  }

  checkMinutes(): void {
    const value = this.timeMMControl.value;
    if (value < 0) {
      this.timeMMControl.setValue('00');
    } else if (value > 59) {
      this.timeMMControl.setValue(completeFullValueLess10(value % 59));
    } else if (!value) {
      this.timeMMControl.setValue(null);
    }
  }

  modifyHH(direction: 1 | -1): void {
    let newValue = (+this.timeHHControl.value + (this.hhStep * direction)) % 24;
    if (newValue < 0) {
      newValue = 24 + newValue;
    }
    this.timeHHControl.setValue(completeFullValueLess10(newValue));
  }

  modifyMM(direction: 1 | -1): void {
    let newValue = (+this.timeMMControl.value + (this.mmStep * direction)) % 60;
    if (newValue < 0) {
      newValue = 60 + newValue;
    }
    this.timeMMControl.setValue(completeFullValueLess10(newValue));
  }

  clearValue(): void {

  }

  newValue(value: any): void {
    this.writeValue(value);
  }
}
