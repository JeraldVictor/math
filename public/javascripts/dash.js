$("#list").ready(()=>{
    let a= $("#list").val()
    // console.log(a)
    $.ajax({
        type: "GET",
        url: "/api/"+a
    }).done ((data)=>{
        // console.log(data)
        $("#timing").val(data.timing)
        $("#date").val(data.date)
        $("#id").val(data.id)
        $("#name").val(`${data.fname} ${data.lname}`)
    })
})
$("#list").on("change",()=>{
    let a= $("#list").val()
    // console.log(a)
    $.ajax({
        type: "GET",
        url: "/api/"+a
    }).done ((data)=>{
        // console.log(data)
        $("#timing").val(data.timing)
        $("#date").val(data.date)
        $("#id").val(data._id)
        $("#name").val(`${data.fname} ${data.lname}`)
    })
})

$("#list1").ready(()=>{
    let a= $("#list1").val()
    // console.log(a)
    $.ajax({
        type: "GET",
        url: "/api/"+a
    }).done ((data)=>{
        // console.log(data)
        $("#timing1").val(data.timing)
        $("#date1").val(data.date)
        $("#id1").val(data.id)
        $("#name1").val(`${data.fname} ${data.lname}`)
    })
})
$("#list1").on("change",()=>{
    let a= $("#list1").val()
    // console.log(a)
    $.ajax({
        type: "GET",
        url: "/api/"+a
    }).done ((data)=>{
        // console.log(data)
        $("#timing1").val(data.timing)
        $("#date1").val(data.date)
        $("#id1").val(data._id)
        $("#name1").val(`${data.fname} ${data.lname}`)
    })
})