import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/Rx';
import { templateJitUrl } from '@angular/compiler';
/*

/*
  Generated class for the ApiRepProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiRepProvider {
  isLoading:boolean=true;
  http: any;
  allItems=[];
  items=[];
  filteredData=[];
  constructor(http: Http) {
    this.http=http;
    console.log('Hello ItemsRepProvider Provider');
    this.isLoading=true;
  }
  GetItems(){
    let url='https://raw.githubusercontent.com/stockholmux/ecommerce-sample-set/master/items.json';
    return this.http.get(url).map(res=>res.json())
  }
  ConvertMiliSecToDate(milisec){
    var currentDate = new Date(milisec);
    var date = currentDate.getDate();
    var month = currentDate.getMonth(); //Be careful! January is 0 not 1
    var year = currentDate.getFullYear();
    
    var dateString = year + "/" +(month + 1) + "/" + date;
    var myDate = new Date(new Date(dateString).getTime()+(915*24*60*60*1000));
   return myDate;
    
  }
  CalculateDays(firstDate,secondDate){
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var ftDate = new Date();
    var sDate = new Date(secondDate);
//Difference_In_Time / (1000 * 3600 * 24); 
    var diffDays = Math.round(Math.abs((ftDate.getTime() - sDate.getTime())/(oneDay)));
    return diffDays;
  }
  convertDate(inputFormat) {
    var todayTime = new Date(inputFormat);
    var month = todayTime .getMonth() + 1;
    var day =todayTime .getDate();
    var year =todayTime .getFullYear();
    return year + "/" + month + "/" + day;
  }
  LoadItems(){
    this.GetItems().subscribe((resp)=>{
      let tags=[];
       this.allItems=resp;
      for(let i=0;i<30;i++){
      
        tags=resp[i]["tags"];
        let added=this.convertDate(this.ConvertMiliSecToDate(resp[i]["added"]));

        this.items.push({
          id:(i+1),
          title:resp[i]["name"].toLowerCase(),
          price:resp[i]["price"],
          added:added,
          today:this.convertDate(new Date()),
          month:new Date(added).getMonth()+1,
          year:new Date(this.ConvertMiliSecToDate(resp[i]["added"])).getFullYear(),
          milesecDate:this.convertDate(this.ConvertMiliSecToDate(resp[i]["added"])),
          discount_offer:i%3==0?(i+1)*5:0,
          start_time:i%2==0?this.convertDate(this.ConvertMiliSecToDate(resp[i]["added"])):null,
          days_diff:this.CalculateDays(this.convertDate(new Date()) ,added),
          tags:tags
        })                
      }
    //  this.isLoading=false;
    setTimeout(()=>{
       this.isLoading=false;
    },2000)
      this.filteredData=this.items.sort(this.SortItemsByDate).reverse();
     console.log(this.items);
    })
  }
  SortItemsByDate(a, b) {
    return new Date(a.added).getTime() - new Date(b.added).getTime();
}

}
