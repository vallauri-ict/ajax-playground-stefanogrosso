"use strict";

$(document).ready(function(){
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const redirectUri = "http://127.0.0.1:8080/upload.html";
    const clientSecret = "ASbePZGSRwx8VdTg8SZ4q_01";
    const pointTO = "https://www.googleapis.com/auth/drive";
    let access_token= "";
    let clientID = "112533485115-7mfg7q4sugvdcu9oujqa7qhkotn9h7ak.apps.googleusercontent.com";


    $.ajax({
        type: 'POST',
        url: "https://www.googleapis.com/oauth2/v4/token",
        data: {
            code:code,
            redirect_uri:redirectUri,
            client_secret:clientSecret,
            client_id:clientID,
            scope:pointTO,
            grant_type:"authorization_code"
        },
        dataType: "json",
        success: function(resultData)
        {
            localStorage.setItem("accessToken",resultData.access_token);
            localStorage.setItem("refreshToken",resultData.refreshToken);
            localStorage.setItem("expires_in",resultData.expires_in);
            window.history.pushState({}, document.title, "/GitLoginApp/" + "login.html");
        }
    });

    function stripQueryStringAndHashFromPath(URL)
    {
        return URL.split("?")[0].split("#")[0];
    }

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

        $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));

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

