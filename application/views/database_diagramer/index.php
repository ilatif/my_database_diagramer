<?php include_once('include_items.php'); ?>
<html>
 <head>
 	<title>My Database Diagramer</title>
 	<style type="text/css">
 		<?php include_items(array("jquery-ui.min.css", "application.css")); ?>
 	</style>
 	<script type="text/javascript">
 			<?php include_items(array("jquery.js", "jquery-ui.min.js", "application.js")); ?>
 	</script>
 <head>
<body>
		
		<!-- GitHub fork me	-->
			<a href="https://github.com/ilatif/my_database_diagramer" target="_blank"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png" alt="Fork me on GitHub"></a>
		<!-- GitHub fork me	-->
		<center class="center">
			<a id="convert_to_image" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" href="#"><span class="ui-button-text">Convert to Image</span></a>
		</center>

		<br />

		<?php
			$number_of_lists = 3;
			$tables_count    = sizeof($tables);
			$tables_per_list = round($tables_count / $number_of_lists);
	 	?>

	 	<?php 
	 		$j = 0;
	 		for ($i = 0; $i <= $number_of_lists ; $i++) {
	 	?>
			<div class="tables">
				<?php
					$k = 0;
					while($k < $tables_per_list) {
							if ($j >= $tables_count) { // End of array.
								break;
							}
							$table = $tables[$j];
							$j++;
							$k++;
							// $table_fields = $this->db->list_fields($table); // This method only provide field names in the form of array.
							$table_fields = $this->db->field_data($table);
				?>		
						<div class="table">
							<div class="table_name"><span class="name"><?php echo $table; ?></span><span class="ui-button-icon-primary ui-icon ui-icon-closethick close delete_table"></span><span class="ui-button-icon-primary ui-icon ui-icon-pencil close edit_field hide"></span></div>
							
							<ul class="table_fields">
								<?php
									foreach ($table_fields as $table_field) {

								?>
									<li class="table_field <?php echo $table_field->primary_key ? 'primary_key' : '' ?>"><span class="name"><?php echo $table_field->name; ?></span><span class="ui-button-icon-primary ui-icon ui-icon-close close delete_field"></span><span class="ui-button-icon-primary ui-icon ui-icon-pencil close edit_field hide"></span></li>
								<?php	
									}
								?>
							</ul>
						</div>
				<?php
					} // end of inner loop
				?>
			</div>
			<?php
			
				}
			?>

			<script type="text/javascript">

			  var _gaq = _gaq || [];
			  _gaq.push(['_setAccount', 'UA-42639068-1']);
			  _gaq.push(['_trackPageview']);

			  (function() {
			    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			  })();

			</script>
</body>
<html>