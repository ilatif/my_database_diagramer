<?php 
	

	function include_items($items) {
		foreach ($items as $item) {
			require_once($item);
		}
	}

?>