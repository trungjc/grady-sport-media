<?php
/*
 * This file is part of the Designmodo WordPress Theme.
*
* (c) Designmodo Inc. <info@designmodo.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
namespace Designmodo\WpTheme\License;

/**
 * License implements license and update features.
 */
class License
{
    /**
     * Init license
     *
     * @return void
     */
    static public function init()
    {
        require_once SF_BASE_PATH . 'vendor/AMTE/functions.php';
    }
}