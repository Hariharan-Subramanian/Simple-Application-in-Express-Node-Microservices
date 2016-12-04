/* seat class*/

var seatClass = function() {
    this.seatMode = 0;
    this.seatNo = 0;
}

/* User class*/

var userClass = function() {
    this.userName = '';
    this.seatCount = 0;
    this.confirmedSeats = [];
}
userClass.prototype.allUser = [];
userClass.prototype.storeSeatdata = function() {
    var userinfo = {
        'uname': this.userName,
        'seatcount': this.seatCount,
        'confirmedseats': this.confirmedSeats
    };
    //  if (typeof(localStorage) !== "undefined") {
    //      if(localStorage.getItem('userinfo') != null){   
    //          var prevdata=JSON.parse(localStorage.getItem('userinfo'));
    //          var that=this;
    //          $.each(prevdata,function(key,item){
    // that.allUser.push(item);
    //          });
    //      }
    //      this.allUser.push(userinfo);

    //    // localStorage.setItem('userinfo', JSON.stringify(this.allUser));
    // } else {
    //     console.log('local storage doesnot support');
    // }
    $.ajax({
        url: '/reserve',
        data: userinfo,
        error: function() {
            $('#info').html('<p>An error has occurred</p>');
        },
        dataType: 'json',
        success: function(data) {
            console.log(data)
            if (parseInt(data.status) == 0) {
               
            }
        },
        type: 'POST'
    });
}
