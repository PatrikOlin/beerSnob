import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'untappdbolaget';
  beerName = 'testbärs';

  constructor() {}
                      
  ngOnInit() {
    this.getBeerFromPage(this._getName)
  }
                      
  getBeerFromPage(callback) {
    let name = 'kuken'; 
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const url = tabs[0].url;
      const urls = url.split('/');
      name = urls[urls.length - 2];    
      callback(name)
    });
  }

  _getName(name){
    alert(name)
    this.beerName = name;       
  }
}
                      
                      
