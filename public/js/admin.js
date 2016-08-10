$(function(){
	$('.del').click(function(e){
		var e= e || event
		var target = $(e.target)
		var id=target.data('id')
		var tr = $('.item-id-' +id)
		console.log(id)
		$.ajax({
			type: 'DELETE',
			url:'/admin/list?id=' + id
		})
		.done(function(results){
			if(results.success === 1){
				if(tr.length>0){
					tr.remove()
				}
			}
		})
	})
})