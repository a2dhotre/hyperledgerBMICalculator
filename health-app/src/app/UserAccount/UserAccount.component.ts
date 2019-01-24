/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserAccountService } from './UserAccount.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-useraccount',
  templateUrl: './UserAccount.component.html',
  styleUrls: ['./UserAccount.component.css'],
  providers: [UserAccountService]
})
export class UserAccountComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  accountId = new FormControl('', Validators.required);
  owner = new FormControl('', Validators.required);
  height = new FormControl('', Validators.required);
  weight = new FormControl('', Validators.required);
  bmi = new FormControl('', Validators.required);

  constructor(public serviceUserAccount: UserAccountService, fb: FormBuilder) {
    this.myForm = fb.group({
      accountId: this.accountId,
      owner: this.owner,
      height: this.height,
      weight: this.weight,
      bmi: this.bmi
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceUserAccount.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'health.UserAccount',
      'accountId': this.accountId.value,
      'owner': this.owner.value,
      'height': this.height.value,
      'weight': this.weight.value,
      'bmi': this.bmi.value
    };

    this.myForm.setValue({
      'accountId': null,
      'owner': null,
      'height': null,
      'weight': null,
      'bmi': null
    });

    return this.serviceUserAccount.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'accountId': null,
        'owner': null,
        'height': null,
        'weight': null,
        'bmi': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'health.UserAccount',
      'owner': this.owner.value,
      'height': this.height.value,
      'weight': this.weight.value,
      'bmi': this.bmi.value
    };

    return this.serviceUserAccount.updateAsset(form.get('accountId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceUserAccount.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceUserAccount.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'accountId': null,
        'owner': null,
        'height': null,
        'weight': null,
        'bmi': null
      };

      if (result.accountId) {
        formObject.accountId = result.accountId;
      } else {
        formObject.accountId = null;
      }

      if (result.owner) {
        formObject.owner = result.owner;
      } else {
        formObject.owner = null;
      }

      if (result.height) {
        formObject.height = result.height;
      } else {
        formObject.height = null;
      }

      if (result.weight) {
        formObject.weight = result.weight;
      } else {
        formObject.weight = null;
      }

      if (result.bmi) {
        formObject.bmi = result.bmi;
      } else {
        formObject.bmi = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'accountId': null,
      'owner': null,
      'height': null,
      'weight': null,
      'bmi': null
      });
  }

}
