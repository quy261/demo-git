function Post(){
    function bindEvent(){
        // handle edit
        $("#post_edit").click(function(e){
            let params = {
                id: $("#id2").val(),
                title: $("#title2").val(),
                content: CKEDITOR.instances["content2"].getData(),
                author: $("#author2").val()
            }
            let base_url = location.protocol + "//" + document.domain + ":" + location.port;

            $.ajax({
                url: base_url + "/admin/post/edit",
                type: "PUT",
                data: params,
                dataType: "json",
                success: function(res){
                    if(res && res.status_code == 200){
                        console.log("PUT: done");
                        location.reload();             
                    }
                    else {
                        console.log("PUT: failed" + res.status_code);
                        stop();
                    }
                },
                error: function(err){
                    console.log("Request failed " + err);
                }
            })
        })

        // handle delete
        $("#btn-delete").click(function(e){
            let status = confirm("Do you want to delete this?");
            // console.log(status);

            if(status){
                let post_id = $(this).attr("post_id");
                let base_url = location.protocol + "//" + document.domain + ":" + location.port;
                $.ajax({
                    url: base_url + "/admin/post/delete",
                    type: "DELETE",
                    data: {id: post_id},
                    dataType: "json",
                    success: function(res){
                        if(res && res.status_code == 200){
                            alert("DELETE done!!!");
                            location.reload();             
                        }
                        else {
                            alert("DELETE failed");
                        }
                    },
                    error: function(err){
                        alert("Request failed");
                        stop();
                    }
                })
            }
        })
    }
    bindEvent();
}

$(document).ready(function(){
    new Post();
})