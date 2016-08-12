import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/contact/contact.html'
})
export class ContactPage {
  contacts: string[] = [];

  constructor(private navCtrl: NavController, private alertController: AlertController) {
    for(let i=0;i<100;i++){
      this.contacts.push(`contact${i}@baidu.com`);
    }
  }

  showContact(contact: string){
     let prompt = this.alertController.create({
      title: contact,
      message: "Enter a name for this new album you're so keen on adding",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }
}
