$('.datepicker').datepicker({
    format: 'dd mm yyyy'
  });

  $("#date").on("change",(value)=>{
      let gdate = $("#date").val();
      console.log(gdate);
      gdate = new Date(gdate);
    // console.log( gdate , new Date() )
    if(gdate > new Date()){
        $("#date").removeClass("is-invalid");
        $("#date").addClass("is-valid");
        let datearray = $("#date").val()
        datearray=datearray.split("/");
        let newdate = datearray[1] + '-' + datearray[0] + '-' + datearray[2];
        $("#date").val(newdate)
        $.ajax({
            type: "GET",
            url: "/date/"+newdate
        }).done ((data) => {
            console.log( "from ajax",data);
        });
    }else{
        $("#date").removeClass("is-valid");
        $("#date").addClass("is-invalid");
    }
    
  })

  $("body").ready(() =>{
    $.ajax({
        type: "GET",
        url: "/avilabe"
    }).done ((data)=>{
        // console.log( "from ajax ",data);
        
        for(let i =0 ;i< data.length ; i++){
            let datearray =data[i];
            datearray=datearray.split("/");
            datearray = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
            // console.log(datearray)
            datearray = new Date(datearray)
            if( datearray >= new Date()){
                $(".booked > tbody:last-child").append('<tr><td>'+data[i]+"</td></tr>")
            }
        }
    });
  })



  // form validation

  $("#myname").on("change",()=>{
    let name =$("#myname").val();
    if(name.length < 4){
      $("#myname").removeClass("is-valid")
      $("#myname").addClass("is-invalid")
    }else{
      $("#myname").removeClass("is-invalid")
      $("#myname").addClass("is-valid")
    }
  })
  $("#suname").on("change",()=>{
    let name =$("#suname").val();
    if(name.length >=1){
        $("#suname").removeClass("is-invalid")
        $("#suname").addClass("is-valid")
    }else{
        $("#suname").removeClass("is-valid")
      $("#suname").addClass("is-invalid")
    }
  })

  $("#grade").on("change",()=>{
    let name =$("#grade").val();
    if(name.length >=6 ){
        $("#grade").removeClass("is-invalid")
        $("#grade").addClass("is-valid")
    }else{
        $("#grade").removeClass("is-valid")
      $("#grade").addClass("is-invalid")
    }
  })

  $("#phn").on("change",()=>{
    let name =$("#phn").val();
    var patt1 = /\D/g;
    let result = ""
    result = name.match(patt1)
    // console.log("contains  ",result)
    // console.log(name[0],name)
    if(name.length >=5 && result == null ){
      $("#phn").removeClass("is-invalid")
      $("#phn").addClass("is-valid")
    }else{
      $("#phn").removeClass("is-valid")
      $("#phn").addClass("is-invalid")
    }
  })