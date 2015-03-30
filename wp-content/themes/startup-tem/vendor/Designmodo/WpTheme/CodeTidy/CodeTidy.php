<?php
/*
 * This file is part of the Designmodo WordPress Theme.
 *
 * (c) Designmodo Inc. <info@designmodo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
namespace Designmodo\WpTheme\CodeTidy;
use Designmodo\WpTheme\CodeTidy\CssTidy\CssTidyWorker;
use Designmodo\WpTheme\CodeTidy\HtmlTidy\HtmlTidyWorker;
/**
 * Implementation of the tiding code 
 *
 */
class CodeTidy {

    public static $pathToCssTyding = '';
    public static $pathToHtmlTyding = '';
    
    public $cssTidyInstance;
    public $htmlTidyInstance;
    /**
     * 
     */
    public function __construct() {
        $this->htmlTidyInstance = HtmlTidyWorker::getInstance();
        $this->cssTidyInstance = CssTidyWorker::getInstance();
    }

    public function parseHtml($html){
        //return $html;
        return $this->htmlTidyInstance->prepareHtml($html);
    }

    public function parseCss($css){
        return $this->cssTidyInstance->prepareCss($css);
    }
}
