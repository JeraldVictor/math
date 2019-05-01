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
        $("#id").val(data._id)
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
