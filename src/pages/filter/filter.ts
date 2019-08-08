import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the FilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage {
  cboxPublished=[];
  published_on:any;
  knobValues: any = {
    upper:0,
    lower:0
  }
  filter_applied:boolean=false;
  title;
  start_time;
  location;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl:ViewController
    ) {
   
    
    if(localStorage.getItem('filter_data')){
       console.log(JSON.parse(localStorage.getItem('filter_data')));
       let localData=[]=JSON.parse(localStorage.getItem('filter_data'));
       this.cboxPublished.push(
        {
          title:"This Week",
          checked:localData[0]["published"][0]["week"]
        },
        {
         title:"This Month",
         checked:localData[0]["published"][0]["thisMonth"]
        },
        {
         title:"6 Months",
         checked:localData[0]["published"][0]["sixMonth"]
        },
        {
         title:"1 Year",
         checked:localData[0]["published"][0]["oneYear"]
        },
        {
         title:">1 Year",
         checked:localData[0]["published"][0]["oneYearGreater"]
        },       
        {
         title:"Discount Offer",
         checked:localData[0]["published"][0]["disCountOffer"]
        }
       );
       if(localData[0]["published_on"]!=null){
         console.log(localData[0]["published_on"])
         this.published_on=new Date(localData[0]["published_on"]).toISOString();
       }
       if(localData[0]["start_time"]!=null){
         this.start_time=new Date(localData[0]["start_time"]).toISOString();
       }
       this.knobValues.upper=localData[0]["price"]["upper"];
       this.knobValues.lower=localData[0]["price"]["lower"];
       this.title=localData[0]["title"]?localData[0]["title"]:"";
       this.location=localData[0]["location"]?localData[0]["location"]:"";
    }


  else{   this.cboxPublished.push(
 
       {
         title:"This Week",
         checked:false
       },
       {
        title:"This Month",
        checked:false
       },
       {
        title:"6 Months",
        checked:false
       },
       {
        title:"1 Year",
        checked:false
       },
       {
        title:">1 Year",
        checked:false
       },       
       {
        title:"Discount Offer",
        checked:false
       }     
     )}
   // }
     console.log(this.cboxPublished);
  }
  cancel(){
    localStorage.removeItem('filter');
    this.navCtrl.pop().then(()=>{
      
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterPage');
  }
  datachanged(event:any,i){
    // event.checked==true?event.checked=false:event.checked=true;
    // if(i==0){
    //    console.log("Here")
    //    if(event.checked==true){
    //      console.log("Inside if")
    //     for(let x=1;x<this.cboxPublished.length;x++){
    //         this.cboxPublished[x]["checked"]=true;
    //     }
    //    }
    //    else{
    //      console.log("Inside elsse")
    //     for(let x=1;x<this.cboxPublished.length;x++){
    //       console.log(this.cboxPublished[x]["checked"])
    //      // this.cboxPublished[x]["checked"]=false;
    //     }
    //    }
 
    // }
    this.cboxPublished[i]["checked"]= event.checked;
    // else{
       // event.checked==true?this.cboxPublished[i]["checked"]=true:this.cboxPublished["checked"]=false;
 //   }
    console.log(this.cboxPublished);
  }
  applyFilter(){

   
  // console.log(new Date(this.published_on).getTime()," ",this.price);
   let filterData=[];
   let week,thisMonth,sixMonth,oneYear,oneYearGreater,disCountOffer;
   week=this.cboxPublished[0]["checked"];
   thisMonth=this.cboxPublished[1]["checked"];
   sixMonth=this.cboxPublished[2]["checked"];
   oneYear=this.cboxPublished[3]["checked"];
   oneYearGreater=this.cboxPublished[4]["checked"];
   disCountOffer=this.cboxPublished[5]["checked"]
   let published=[];
   published.push({
     week:week,
     thisMonth:thisMonth,
     sixMonth:sixMonth,
     oneYear:oneYear,
     oneYearGreater:oneYearGreater,
     disCountOffer:disCountOffer
   })
   let price=[]=this.knobValues;
   let pubDate='';
   let stTime='';
   if(this.published_on!=null){
     let dt=new Date(this.published_on);
     pubDate=dt.getFullYear()+"/"+(dt.getMonth()+1)+"/"+dt.getDate();
   }
   if(this.start_time!=null){
    let dt=new Date(this.start_time);
    stTime=dt.getFullYear()+"/"+(dt.getMonth()+1)+"/"+dt.getDate();
   }
   filterData.push
   (

     {
       published,
       price:price,
       title:this.title,
       location:this.location,
       published_on:this.published_on!=null?pubDate:this.published_on,
       start_time:this.start_time!=null?stTime:this.start_time
     }
   )
  if
  ( 
     week==true || thisMonth==true|| sixMonth==true|| oneYear==true
     || oneYearGreater===true|| disCountOffer==true 
     ||(this.knobValues["lower"]>=0 && this.knobValues["upper"]>0
     || this.title!=null || this.start_time !=null || this.published_on!=null
     || this.location!=null 
  )  ){
    localStorage.setItem('filter',"true");
   localStorage.setItem('filter_data',JSON.stringify(filterData));
    console.log(filterData);
  }
  else{
    localStorage.removeItem('filter');
  }
  this.viewCtrl.dismiss();
 
  // this.viewCtrl.dismiss();
  }
}