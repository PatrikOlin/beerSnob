import { Component, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'untappdbolaget';
  public beerName: string;

  constructor(private ngZone: NgZone) {}
                      
  ngOnInit() {
    this.getBeerFromPage();
  }
                      
   getBeerFromPage() {
    let name = 'kuken'; 
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs[0]) {
      const name = tabs[0].title.split('|')[0];              
        this.ngZone.run(() => this.beerName = name)
      }
    });      
  }

}
                      
                      
