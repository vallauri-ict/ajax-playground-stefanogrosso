"use strict";

$(document).ready(function(){
    let clientID = "112533485115-q2g4rm7s2kh9qr0476rau3cgv4qn3o3c.apps.googleusercontent.com";
    const redirectUri = "http://127.0.0.1:8080/login.html";
    const clientSecret = "8a7c1ClIutbheQNik5Me3kMe";
    const pointTO = "https://www.googleapis.com/auth/drive";
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');


    let Upload = function (file)
    {
        this.file = file;
    };

    Upload.prototype.getType = function()
    {
        localStorage.setItem("type",this.file.type);
        return this.file.type;
    };
    Upload.prototype.getSize = function()
    {
        localStorage.setItem("size",this.file.size);
        return this.file.size;
    };
    Upload.prototype.getName = function()
    {
        return this.file.name;
    };

    Upload.prototype.doUpload = function ()
    {
        let that = this;
        let formData = new FormData();

        formData.append("file", this.file, this.getName());
        formData.append("upload_file", true);
        let at=localStorage.getItem("accessToken");
        $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Bearer" + " " + at);

            },
            url: "https://www.googleapis.com/upload/drive/v2/files",
            data:{
                uploadType:"media"
            },
            xhr: function () {
                let myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', that.progressHandling, false);
                }
                return myXhr;
            },
            success: function (data) {
                console.log(data);
                //window.location.href="http://127.0.0.1:8080";
            },
            error: function (error) {
                console.log(error);
            },
            async: true,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000
        });
    };

    Upload.prototype.progressHandling = function (event)
    {
        let percent = 0;
        let position = event.loaded || event.position;
        let total = event.total;
        let progress_bar_id = "#progress-wrp";
        if (event.lengthComputable)
            percent = Math.ceil(position / total * 100);

        $(progress_bar_id + " .progress-bar").css("width", +percent + "%");
        $(progress_bar_id + " .status").text(percent + "%");
    };

    $("#upload").on("click", function (e)
    {
        let file = $("#files")[0].files[0];
        let upload = new Upload(file);
        upload.doUpload();
    });
});

