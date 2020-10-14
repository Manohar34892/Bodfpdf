$(document).ready(function(){
	var $table=$('#table-view');
	

	if($table.length){
		var jsonUrl='';
		jsonUrl='http://localhost:8080/rest/getall';
	
		$table.dataTable({
		
		ajax:{
			url:jsonUrl,
			dataSrc:  'content'
			},
			columns: [
				{
					data:'entityName'
				},
				{
					data:'issueDate'
				},
				{ 
					data:'maturityDate'
				},
				{
					data:'currency'
				},
				{
					data:'amountIssued'
				},
				{
					data:'couponType'
				},
				{
					data:'coupon'
				},
				{
					data:'type'
				},
				{
					data:'pages'
				},
				{
					data:'document'
				}

				
			]
		});
	}
		
});
$(document).ready(function() { 
	  $("#quickSearchFacade").click(function(){
		    $("#quickSearch").show();
		    search();
	  });
	});
function search () {

var entityname =$("#entityname").val();

/*  $http({	  
   url : './rest/getbyname',
   method : "GET",
   dataType : "json",
   contentType: "application/x-www-form-urlencoded; charset=UTF-8",
   data : {           
       'entityname' :entityname
   }

}).then(function (response) {
alert("id  "+response.data.id);

})  */
$.ajax({
	  url: "/rest/getbyname",
	  type: "GET", //send it through get method
	  data : {           
	         'entityname' :entityname
	     },
	  success: function(response) {
	    //Do Something
	
	    _updateTable(response);
	      $('#quickSearch').hide();
	      entityname='';
	  },
	 
	});


}

function _updateTable(data) {
	
	var myTable = $('#table-view').dataTable( {
		"data": data,
		"bSort" : false,
		"bFilter": false,
		"bDestroy": true,
		"bInfo": false,
		"bLengthChange": false,
		"bPaginate": true,
		"iDisplayLength": 10,
		"searching": true,
		//"iDeferLoading":1,
		"scrollY": $(document).height()-140 + 'px',
		"scrollCollapse": true,
		columns: [
			{
				data:'entityName'
			},
			{
				data:'issueDate'
			},
			{ 
				data:'maturityDate'
			},
			{
				data:'currency'
			},
			{
				data:'amountIssued'
			},
			{
				data:'couponType'
			},
			{
				data:'coupon'
			},
			{
				data:'type'
			},
			{
				data:'pages'
			},
			{
				data:'document'
			}

			
		],
		"columnDefs": []
	} );

	 $(window).bind('resize', function () {
		var NewHeight = $(document).height() - 140;
		var oSettings = myTable.fnSettings();
		oSettings.oScroll.sY = NewHeight + "px";
		myTable.fnDraw();
	});

	// Keep the header horizontal scroll equal to body
	var $parent = $('#table-view').closest('.dataTables_scroll');
	var $head = $parent.find('.dataTables_scrollHead');
	var $body = $parent.find('.dataTables_scrollBody');
	$body.on('scroll', function () {
		var scrollLeft = $body.scrollLeft();
		if ( $head.scrollLeft() !== scrollLeft )
			$head.scrollLeft(scrollLeft);
	}); 
}

