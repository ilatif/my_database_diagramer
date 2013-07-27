var tables = [], canvas, context, previous_pencil_target = undefined;
$(function() {

	$(".table").resizable();
	$(".tables").sortable({
		connectWith: '.tables'
	});
	$('.table_fields').sortable();

	// Giving user the ability to edit name of any table or field by double clicking on it.
	$(".tables").click(function(e) {
		var target = $(e.target);

		// Check whether user is trying to edit name.
		if (target.hasClass("edit_field")) {
			target.prev("span").hide(); // Hiding close button
			var name_span = target.prevAll(".name");

			var textbox = $("<div class='temp'><input type='text' name='change' class='change_text' autocomplete='off' value='" + name_span.text() + "' data-current-value='" + name_span.text() + "' /> \
											 <span class='ui-button-icon-primary ui-icon ui-icon-circle-close close cancel_new_name'></span> \
											 <span class='ui-button-icon-primary ui-icon ui-icon-circle-check close insert_new_name'></span> \
											 </div>"
										 );

			name_span.replaceWith(textbox);

			var change_text = textbox.find(".change_text");

			change_text.select().focus();
			
			change_text.keydown(function(e) {
				if (e.keyCode == 13) { // Replace the content of field with new text from textbox.
					replace_textbox_with_name_span(name_span, textbox, $(this).val(), "new_name");
				} else if (e.keyCode == 27) { // Replace the content of field with previous textbox value.
					replace_textbox_with_name_span(name_span, textbox, $(this).data("data-current-value"), "old_name");
				}
			});

			textbox.find(".insert_new_name").click(function() {
				replace_textbox_with_name_span(name_span, textbox, change_text.val(), "new_name");
			});

			textbox.find(".cancel_new_name").click(function() {
				replace_textbox_with_name_span(name_span, textbox, change_text.data("data-current-value"), "old_name");
			});

		} else if (target.hasClass("delete_table")) { // User is trying to delete a table.
			var result = confirm("Are you sure you want to remove this table?");
			if (result) {
				target.parent().parent().remove();
			}
		} else if (target.hasClass("delete_field")) { // User is trying to delete a field.
			target.parent().remove();
		}
		return false;
	});

	// Showing / Hiding edit_pencil_icon
	$(".tables").mouseover(function(e) {
		var target = $(e.target), edit_field;
		
		if (target.hasClass("edit_field")) { // If mouse is on edit_pencil icon then we don't need to display / hide anything.
			return false;
		}

		if (previous_pencil_target) { // Hiding previously displayed pencil icon.
			previous_pencil_target.find(".edit_field").addClass("hide");
		}

		if(target.hasClass("table_field") || target.hasClass("table_name")) { // If mouse in on table_field or table_name then show the pencil icon.
			edit_field = target.find(".edit_field")
		} else if (target.hasClass("name")) {
			edit_field = target.nextAll(".edit_field")
			target = target.parent();
		}
	
		if (edit_field) {
			edit_field.removeClass("hide");
		}

		previous_pencil_target = target; // Saving the reference of current target so that when we comes in this method next time we don't have to search for element which have pencil icon displayed (an optimization technique).
	})

	$("#convert_to_image").click(function() {

		var result = confirm("Are you sure you want to convert following table structure into image.");
		if (!result) { // User don't want to convert at the moment.
			return false;
		}

		TableGenerator.generate();

		var canvas_height = adjust_canvas_height();

		$("body").html("<canvas id='the_canvas' width='1000' height='1000'></canvas>");
		canvas  = $("#the_canvas")[0];
		context = canvas.getContext('2d');
		
		// canvas.width  = document.width * 2;
		// canvas.height = canvas_height * 2;
		
		// canvas.width  = document.width * 1; // This is working fine on Chrome but not on firefox. So we will be using jQuery way to get width of document.
		canvas.width  = $(document).width();
		canvas.height = canvas_height * 1;
		
		Diagramer.draw(TableGenerator.tables);
		ImageGeneratorFromCanvas.generate();
		return false;
	});
})

// This class represents single table.
var table = function(name, x, y, width, height) {
	this.x            = x;
	this.y            = y;
	// this.name         = name;
	this.width        = width;
	this.height       = height;
	this.selected     = false;
	this.color        = undefined;
	this.table_name   = undefined;
	this.table_fields = [];
}

var table_name = function(name, x, y, width, height) {
	this.name   = name;
	this.x      = x;
	this.y      = y;
	this.width  = width;
	this.height = height;
}

// This class represents single table_field in table.
var table_field = function(name, x, y, width, height) {
	this.x      = x;
	this.y      = y;
	this.name   = name;
	this.width  = width;
	this.height = height;
	this.color  = undefined;
}

// This object draw tables objects on Canvas.
var Diagramer = {
	clear: function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
	},
	draw: function(tables) {
		var total_height = 0;
		this.clear();
		// this.scale();
		for(i = 0; i < tables.length; i++) {
			var table = tables[i];

			total_height += table.height;

			// context.fillStyle = table.selected ? "blue" : "black";
			context.strokeStyle = 'gray';
			context.strokeRect(table.x, table.y, table.width, table.height);
			context.fillStyle = table.color;
			context.fillRect(table.x, table.y, table.width, table.height);
			context.fillStyle = "black";
			context.font      = "bold 13px sans-serif";
			context.fillText(table.table_name.name, table.table_name.x, table.table_name.y + table.table_name.height);

			for (j = 0; j < table.table_fields.length; j++) {
				var table_field = table.table_fields[j];
				context.strokeStyle = 'gray';
				context.strokeRect(table_field.x, table_field.y, table_field.width, table_field.height);
				context.fillStyle = table_field.color;
				context.fillRect(table_field.x, table_field.y, table_field.width, table_field.height);
				context.fillStyle = "black";
				context.font      = "italic 13px sans-serif";
				context.fillText(table_field.name,table_field.x, table_field.y + table_field.height);
			}
		}
		// canvas.height = total_height;
	},
	scale: function() {
		context.scale(2, 2);
	}
}

// This object is responsible for creating table objects from DOM.
var TableGenerator = {
	tables: [],
	generate: function() {
		this.reset();

		var tables = $(".tables").offset();
		// Looping over each table.
		$(".table").each(function() {
			var dom_table = $(this); // Table Structure in DOM.
			var t         = new table(); // Table object that will be used to draw on Canvas.
			
			t.x      = dom_table.offset().left - tables.left;
			t.y      = dom_table.offset().top  - tables.top;
			t.width  = dom_table.width();
			t.height = dom_table.height();
			t.color  = dom_table.css("background-color");

			var dom_table_name = dom_table.find('.table_name'); // Table Name Sturucture in DOM.
			var tn             = new table_name();
			tn.name            = dom_table_name.text();
			tn.x               = Math.abs(dom_table_name.offset().left - tables.left);
			tn.y               = Math.abs(dom_table_name.offset().top - tables.top);
			tn.width           = dom_table_name.width();
			tn.height          = dom_table_name.height();

			var table_fields = [];
			dom_table.find('.table_field').each(function() {
				var dom_table_field = $(this);
				
				var tf    = new table_field();
				tf.name   = dom_table_field.text();
				tf.x      = Math.abs(dom_table_field.offset().left - tables.left);
				tf.y      = Math.abs(dom_table_field.offset().top - tables.top);
				tf.width  = dom_table_field.width();
				tf.height = dom_table_field.height();
				tf.color  = dom_table_field.css("background-color");
				table_fields.push(tf);
			});

			t.table_name = tn;
			t.table_fields = table_fields;
			TableGenerator.tables.push(t);

		});
		
	},
	reset: function() {
		this.tables = [];
	}
}

var ImageGeneratorFromCanvas = {
	generate: function() {
		var image = new Image();
		image.src = canvas.toDataURL();
		image.onload = function() {
			$("#the_canvas").remove();
			$("body").prepend(ImageGeneratorFromCanvas.image_generation_success_html());
			$("body").append("<img src='" + image.src + "' />");
			setTimeout("$('.center').hide('slow')", 3000);
		}
	},
	image_generation_success_html: function() {
		return '<center class="center ui-button ui-widget ui-corner-all ui-button-text-only" style="z-index: 999;"><span class="ui-button-text">Image generated successfully</span></center>';
	}
}

// We will get top and height of last table dom element.
function adjust_canvas_height() {
	// var last_table = TableGenerator.tables[TableGenerator.tables.length - 1];
	// return last_table.y + last_table.height + 300;
	var total_height = 0;
	$(".tables").each(function(index) {
		var table = $(this);
		var table_height = table.height();
		if (table_height > total_height) {
			total_height = table_height;
		} else if (index == 3) { // We have divided tables list into 03 Columns layout so we will be getting highest from the first three and then adding 04th height by-default.
			total_height += table_height;
		}
	});
	return total_height;
}

function replace_textbox_with_name_span(name_span, textbox, value, insertion_type) {
		if (insertion_type == "new_name" && $.trim(value) == "") { // User is inserting new value but value is empty.
			alert("Please! enter name");
			return false;
		}
		name_span.text(value);
		textbox.replaceWith(name_span);
		name_span.next("span").show(); // Showing close button
}