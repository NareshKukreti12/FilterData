import { Component,ViewChildren,ElementRef, QueryList } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { ApiRepProvider } from '../../providers/api-rep/api-rep';
import { FilterPage } from '../filter/filter';
import { JsonPipe } from '@angular/common';
//import { myEnterAnimation } from './animations/enter'
//import { myLeaveAnimation } from '../animations/animations';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChildren('itemlist', { read: ElementRef }) items1: QueryList<ElementRef>;
   items=[]
  constructor(public navCtrl: NavController,public api_rep:ApiRepProvider,   
    public modal:ModalController
    ) {
     this.CalculateDays('2019-07-27','2019-07-10')
  }



  ngOnInit(){
  this.api_rep.LoadItems();
  }
   
  id:any;
  delItems=[];
  delete(item){
    if(this.id!=null){
      clearTimeout(this.id);
    }
     this.delItems.push([
       item.title
     ])
    this.api_rep.filteredData = this.api_rep.filteredData.filter(i => i.id != item.id);
    this.id=setTimeout(()=>{
      console.log(this.delItems)
    },3000)
    
  }
  
  // presentLoadingDefault() {
  //   this.loading = this.loadingCtrl.create({
  //     content: 'Loading data...'
  //   });
  
  //   this.loading.present();
  
    
  // }

  CalculateDays(firstDate,secondDate){
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var ftDate = new Date(firstDate);
    var sDate = new Date(this.ConvertMiliSecToDate(secondDate));

    var diffDays = Math.round(Math.abs((ftDate.getTime() - sDate.getTime())/(oneDay)));
    return diffDays;
  }

  OpenFilter(){
  
   const modal = this.modal.create(FilterPage,{});
    modal.onDidDismiss(() => {
      console.log(localStorage.getItem('filter'))
      if(localStorage.getItem('filter')){
        console.log("Filtering items")
        this.api_rep.isLoading=true;
        let filterData=[];
        filterData=JSON.parse(localStorage.getItem('filter_data'));
        console.log('I am here',);
         let arr=[];
         let temp=[];
         console.log(filterData[0]["published"][0]["week"])
         if(filterData[0]["published"][0]["week"]==true){ 
           temp.push(this.api_rep.items.filter((x)=>{ return   ( x.days_diff<=7 )  }))
          
          };
          if(filterData[0]["published"][0]["thisMonth"]==true){
            temp.push(this.api_rep.items.filter((x)=>{ return   ( x.month==(new Date().getMonth()+1) &&x.year<=new Date().getFullYear() )}))
          }
          if(filterData[0]["published"][0]["sixMonth"]==true){
            temp.push(this.api_rep.items.filter((x)=>{ return   ( x.days_diff<=180 )  }))
          }
          if(filterData[0]["published"][0]["oneYear"]==true){
            temp.push(this.api_rep.items.filter((x)=>{ return   ( x.days_diff<=365 )  }))
          }
          if(filterData[0]["published"][0]["oneYearGreater"]==true){
            temp.push(this.api_rep.items.filter((x)=>{ return   ( x.days_diff>365 )  }))
          }
          if(filterData[0]["published"][0]["disCountOffer"]==true){
            temp.push(this.api_rep.items.filter((x)=>{ return   ( x.discount_offer>0)  }))
          }
          if(filterData[0]["price"]["lower"]>=0 && filterData[0]["price"]["upper"]>0)
          {
            let lower=filterData[0]["price"]["lower"];
            let upper=filterData[0]["price"]["upper"];
            temp.push(this.api_rep.items.filter((x)=>
            { 
              return  x.price >= lower && x.price <= upper  }
            ))
          }
          if(filterData[0]["published_on"]!=null){
            console.log(filterData[0]["published_on"]);
            temp.push(this.api_rep.items.filter((x)=>{ 
              return   ( 
               x.added==filterData[0]["published_on"]
              )  
            }))
          }

          if(filterData[0]["title"]!=null){
            temp.push(this.api_rep.items.filter((x)=>{ return ( x.title.indexOf((filterData[0]["title"]).toLowerCase())>=0)}))
          }
          if(filterData[0]["start_time"]!=null){
            console.log("Here");
             temp.push(this.api_rep.items.filter((x)=>{ return ( x.start_time=filterData[0]["start_time"])}))
          }
    //      arr.findIndex(obj=>this.formatDate(obj.reminder.date)==day.dateString)>=0?this.setState({visible:true}):this.setState({visible:false});


          let mergedArray=[];
          for(let i=0;i<temp.length;i++){
            let arr=[]=temp[i];
             for(let j=0;j<arr.length;j++){
               if(mergedArray.length==0){
               mergedArray[j]=arr[j]
               }
               else {
              //  if(mergedArray.findIndex(obj=>obj.id==arr[j]["id"]<0)){
                let index=mergedArray.findIndex(obj=>obj.id==arr[j]["id"])
                 if(index<0){
                  mergedArray[j]=arr[j]
                 }
                //  mergedArray[j]=arr[j]
                }
               }
             }
            
         // }
          
          console.log(mergedArray)
           this.api_rep.filteredData=mergedArray;
           this.api_rep.isLoading=false;
         // if()
       
       //  this.api_rep.filteredData=temp[0];
       //   console.log(this.api_rep.filteredData);
          // temp.push(arr);
          
      }

    //  this.presentLoadingDefault();
    //   let price=[];
    //   price=JSON.parse(localStorage.getItem('filter'))
    //   let lower=price[0]["price"]["lower"];
    //   let upper=price[0]["price"]["upper"];
    //   // Do things with data coming from modal, for instance :
    //  // if()
    //   let temp=[]=this.api_rep.allItems.filter((x)=>{ 
    //     return x.price >= lower && x.price <= upper}
    //     );
    //   console.log(temp);
    //   this.GetData(temp,temp.length)
      
      });
  
   modal.present();


  
  }
  
  GetData(allImages,length){
    this.items=[];
    for(let i=0;i<length;i++){
      let tags=[];
      tags=allImages[i]["tags"];
      this.items.push({
        title:allImages[i]["name"],
        price:allImages[i]["price"],
        added:this.ConvertMiliSecToDate(allImages[i]["added"]),
        tags:tags
      })
    }  
  //  this.loading.dismiss();
  }


  ConvertMiliSecToDate(milisec){
    var currentDate = new Date(milisec);
    var date = currentDate.getDate();
    var month = currentDate.getMonth(); //Be careful! January is 0 not 1
    var year = currentDate.getFullYear();
    
    var dateString = year + "/" +(month + 1) + "/" + date;
   return dateString;
    
  }
  anim(i){
    return {'show':true}
  }
}

