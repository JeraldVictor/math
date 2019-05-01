$('.datepicker').datepicker({
    format: 'dd mm yyyy'
  });

  $("#date").on("change",(value)=>{
      let gdate = $("#date").val();
      gdate = new Date(gdate);
    if(gdate > new Date()){
        let newdd = $("#date").val()
        newdd=newdd.split("/");
        let newdate = newdd[1] + '-' + newdd[0] + '-' + newdd[2];
        console.log(newdate)
        $("#date").val(newdate)
        $.ajax({
          type: "GET",
          url: "/avilabe"
        }).done ((data) => {
            for(let i =0 ;i< data.length ; i++){
              let datearray =data[i];
              datearray=datearray.split("-");
              datearray = datearray[0] + '-' + datearray[1] + '-' + datearray[2];
              if( datearray == newdate){
                $("#date").removeClass("is-valid");
                $("#date").addClass("is-invalid");
                break;
              }else{
                $("#date").removeClass("is-invalid");
                $("#date").addClass("is-valid");
              }
          }
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
        for(let i =0 ;i< data.length ; i++){
            let datearray =data[i];
            datearray=datearray.split("-");
            datearray = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
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
    if(name.length >=5 && result == null ){
      $("#phn").removeClass("is-invalid")
      $("#phn").addClass("is-valid")
    }else{
      $("#phn").removeClass("is-valid")
      $("#phn").addClass("is-invalid")
    }
  })