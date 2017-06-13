<?php
/**
 * @file
 * Template file for the owl-carousel-formatter
 */

?>
<div class="owl-carousel-formatter carousel">
  <?php foreach ($items as $id => $data): ?>
    <div>
      <?php print $data['item']; ?>
    </div>
  <?php endforeach; ?>
</div>
