import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace health{
   export class UserAccount extends Asset {
      accountId: string;
      owner: User;
      height: number;
      weight: number;
      bmi: number;
   }
   export class User extends Participant {
      userId: string;
      firstName: string;
      lastName: string;
   }
   export class CalculateBMI extends Transaction {
      user: UserAccount;
   }
   export class BmiCalculatedEvent extends Event {
      user: UserAccount;
      OldBmi: number;
      NewBmi: number;
   }
// }
