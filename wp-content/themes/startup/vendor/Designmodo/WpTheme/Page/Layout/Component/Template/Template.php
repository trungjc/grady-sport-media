<?php
/*
 * This file is part of the Designmodo WordPress Theme.
 *
 * (c) Designmodo Inc. <info@designmodo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
namespace Designmodo\WpTheme\Page\Layout\Component\Template;

use Designmodo\WpTheme\Utility\Db;
/**
 * Template implements the HTML\CSS etc resources providing for components of layout.
 */
class Template
{

    const RESOURCE_TPL = 'tpl';

    const RESOURCE_CSS = 'css';

    const RESOURCE_JSON = 'json';

    const RESOURCE_JS = 'js';

    /**
     * Template ID.
     *
     * @var string
     */
    protected $id;

    /**
     * Constructor
     *
     * @param string $id
     * @return void
     */
    public function __construct($id)
    {
        if (!empty($id)) {
            $this->id = $id;
        } else {
            throw new \Exception('Could not create Template object with empty ID.', 348734);
        }
    }

    /**
     * Get path of resources
     *
     * @param string $resourceType
     * @return string
     */
    public function getResourcePath($resourceType)
    {
        if (! preg_match(SF_TEMPLATE_ID_REGEX, $this->getId())) {
            throw new \Exception('Invalid format of the template ID "' . $this->getId() . '".', 23874);
        }
        $segments = explode(SF_TEMPLATE_DELIMETER, $this->getId());

        switch ($resourceType) {
            case self::RESOURCE_TPL:
                $filePath = 'ui-kit-' . $segments[0] . SF_DS . 'components' . SF_DS . $segments[1] . SF_DS . $segments[1] . SF_TPL_EXT;
                break;
            case self::RESOURCE_CSS:
                $fname = $segments[1] . '.css';
                $matches = null;
                if (preg_match('/^([a-z]+)(\d+)$/i', $segments[1], $matches)) {
                    $fname = $matches[1] . '-' . $matches[2] . '-style.css';
                }
                $filePath = 'ui-kit-' . $segments[0] . SF_DS . 'css' . SF_DS . $fname;
                break;
            case self::RESOURCE_JSON:
                $filePath = 'ui-kit-' . $segments[0] . SF_DS . 'components' . SF_DS . $segments[1] . SF_DS . $segments[1] . '.json';
                break;
            case self::RESOURCE_JS:
                $filePath = 'ui-kit-' . $segments[0] . SF_DS . 'js' . SF_DS . $segments[0] . '.js';
                break;
        }
        return $filePath;
    }

    /**
     * Get default data model
     *
     * @return mixed
     */
    public function getDefaultModel()
    {
        if (file_exists($jsonFile = SF_TPL_PATH . SF_DS . $this->getResourcePath(self::RESOURCE_JSON))) {
            $data = file_get_contents($jsonFile);
        } else if (file_exists($jsonFile = SF_TPL_BUILDIN_PATH . SF_DS . $this->getResourcePath(self::RESOURCE_JSON))) {
            $data = file_get_contents($jsonFile);
        } else {
            $data = Db::getColumn(
                'SELECT `data` FROM `' . Db::getThemeTableName(Db::TABLE_RESOURCE) . '` WHERE template_id = %s AND type = %s LIMIT 1',
                array(
                    $this->getId(),
                    self::RESOURCE_JSON
                )
            );
        }
        return json_decode($data, true);
    }

    /**
     * Is template custom
     *
     * @return mixed
     */
    public function isCustom()
    {
        $segments = explode(SF_TEMPLATE_DELIMETER, $this->getId());

        return (count($segments) < 2 ? false : $segments[0] == 'custom');
    }

    /**
     * Get template ID.
     *
     * @return string
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Template to string.
     *
     * @return string
     */
    public function __toString()
    {
        return $this->getId();
    }
    /**
     * TODO should be fixed build path to images in Grunt for styles
     * @param string $source
     * @return type
     */
    public static function relativeToAbsoleteImages($source) {
        $search = array("url('../wp-content/themes/startup"
                        ,'url("../wp-content/themes/startup'
                        ,"url('../../../common-files/img"
                        ,'url("../../../common-files/img'
        );
        $replace = array("url('".SF_WP_TPL_URI,
                        'url("'.SF_WP_TPL_URI,
                        "url('".SF_WP_TPL_URI.'/templates/startup-framework/build-wp/common-files/img',
                        'url("'.SF_WP_TPL_URI.'/templates/startup-framework/build-wp/common-files/img'
        );
        return str_replace($search,$replace , $source);
    }
}