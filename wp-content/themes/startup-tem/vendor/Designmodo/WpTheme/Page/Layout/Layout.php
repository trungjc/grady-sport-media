<?php
/*
 * This file is part of the Designmodo WordPress Theme.
 *
 * (c) Designmodo Inc. <info@designmodo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
namespace Designmodo\WpTheme\Page\Layout;

use Designmodo\WpTheme\Utility\Db;
use Designmodo\WpTheme\Page\Layout\Component\Component;
use Designmodo\WpTheme\Http\Http;
use Designmodo\WpTheme\Page\Layout\Component\Template\Template;
use Designmodo\WpTheme\Utility\Context;

/**
 * Layout implements sequence of components on a page.
 */
class Layout
{

//     const SYSTEM_LAYOUT_DEFAULT = 1;

//     const SYSTEM_LAYOUT_HOME = 2;

//     const SYSTEM_LAYOUT_PAGE = 3;

//     const SYSTEM_LAYOUT_POST = 4;

//     const SYSTEM_LAYOUT_ARCHIVE = 5;

//     const SYSTEM_LAYOUT_404 = 6;

//     const SYSTEM_LAYOUT_SEARCH = 7;

    const SYSTEM_COMPONENT_HEADER = 1;

    const SYSTEM_COMPONENT_FOOTER = 2;

//     const SYSTEM_COMPONENT_ADMIN_LAYOUT = 3;

    /**
     * Layout ID
     *
     * @var string
     */
    protected $id;

    /**
     * Layout type
     *
     * @var bool
     */
    protected $isSystem;

    /**
     * Components
     *
     * @var array
     */
    protected $components;

    /**
     * Constructor
     *
     * @return void
     */
    public function __construct($id = null)
    {
        $this->id = $id;
        if ($this->getId()) {
            $layout = Db::getRow(
                'SELECT * FROM `' . Db::getThemeTableName(Db::TABLE_LAYOUT) . '` WHERE id = %d',
                array($id)
            );
            if (empty($layout)) {
                throw new \Exception('Layout "' . $this->getId() . '" not found.', 485546);
            }
            $this->isSystem = (bool) $layout['is_system'];
            $this->components = array();
            $components = Db::getAll(
                'SELECT * FROM `' .  Db::getThemeTableName(Db::TABLE_LAYOUT_COMPONENT) . '`
                    WHERE `layout_id` = %d ORDER BY `order` ASC',
                array($this->getId())
            );
            foreach ($components as $component) {
                try {
                    $this->components[] = new Component($component['component_id']);
                } catch (\Exception $e) {
                    if ($e->getCode() != 435736) {
                        throw $e;
                    }
                }
            }
        } else {
            $this->isSystem = false;
            $this->components = array();
        }
    }

    /**
     * Get type
     *
     * @return bool
     */
    public function isSystem()
    {
        return $this->isSystem;
    }

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Get layout components
     *
     * @return array
     */
    public function getComponents()
    {
        return $this->components;
    }

    /**
     * Set layout components
     *
     * @param array $componentIds
     * @return void
     */
    public function setComponents($componentIds)
    {
        $this->components = array();
        foreach ($componentIds as $componentId) {
            $this->components[] = new Component($componentId);
        }
    }

    /**
     * Save layout
     *
     * @param bool $preview
     * @return int
     */
    public function save($preview = false)
    {
        if (!$this->getId()) {
            $result = Db::insert(Db::getThemeTableName(Db::TABLE_LAYOUT), array('is_system' => $this->isSystem()));
            if ($result === false) {
                throw new \Exception('Can not save layout.', 432214);
            }
            $this->id = $result;
        }

        Db::delete(
            Db::getThemeTableName(Db::TABLE_LAYOUT_COMPONENT),
            array(
                'layout_id' => $this->getId()
            )
        );

        foreach ($this->getComponents() as $index => $component) {
            if (!$preview) {
                Db::update(
                    Db::getThemeTableName(Db::TABLE_COMPONENT),
                    array('is_hidden' => false),
                    array('id' => $component->getId())
                );
            }
            Db::insert(
                Db::getThemeTableName(Db::TABLE_LAYOUT_COMPONENT),
                array(
                    'layout_id' => $this->getId(),
                    'component_id' => $component->getId(),
                    'order' => $index
                )
            );
        }
        return $this->getId();
    }

    /**
     * Delete layout
     *
     * @return bool
     */
    public function delete()
    {
        if (! $this->isSystem() && $this->getId()) {
            // Delete record
            Db::delete(
                Db::getThemeTableName(Db::TABLE_LAYOUT),
                array(
                    'id' => $this->getId()
                )
            );
            Db::delete(
                Db::getThemeTableName(Db::TABLE_LAYOUT_COMPONENT),
                array(
                    'layout_id' => $this->getId()
                )
            );
            return true;
        }
        return false;
    }

    /**
     * Render layout
     *
     * @param int $contentType HTML or CSS
     * @param bool $withHeaderFooter Add header and footer parts
     * @return string
     */
    public function render($contentType, $withHeaderFooter = true)
    {
        switch ($contentType) {
            case Http::CONTENT_TYPE_HTML:
                if ($withHeaderFooter) {
                    $components = array_merge(
                        array(new Component(self::SYSTEM_COMPONENT_HEADER)),
                        $this->getComponents(),
                        array(new Component(self::SYSTEM_COMPONENT_FOOTER))
                    );
                } else {
                    $components = $this->getComponents();
                }
                $resourceType = Template::RESOURCE_TPL;
                break;
            case Http::CONTENT_TYPE_CSS:
                if ($withHeaderFooter) {
                    $components = array_merge(
                        array(new Component(self::SYSTEM_COMPONENT_HEADER)),
                        $this->getComponents()
                    );
                } else {
                    $components = $this->getComponents();
                }
                $resourceType = Template::RESOURCE_CSS;
                break;
            default:
                throw new \Exception('Unknown content type tryed to render.', 873132);
                break;
        }
        $result = '';

        foreach ($components as $component) {
            if (file_exists(SF_TPL_PATH. SF_DS . $component->getTemplate()->getResourcePath($resourceType))){
                $data = file_get_contents(SF_TPL_PATH. SF_DS . $component->getTemplate()->getResourcePath($resourceType));
            } elseif (file_exists(SF_TPL_BUILDIN_PATH. SF_DS . $component->getTemplate()->getResourcePath($resourceType))){
                $data = file_get_contents(SF_TPL_BUILDIN_PATH. SF_DS . $component->getTemplate()->getResourcePath($resourceType));
            } else {
                $data = Db::getColumn(
                    'SELECT `data` FROM `' . Db::getThemeTableName(Db::TABLE_RESOURCE) . '` WHERE template_id = %s AND type = %s LIMIT 1',
                    array(
                        $component->getTemplate()->getId(),
                        $resourceType
                    )
                );
                if (is_null($data)) {
                    continue;
                }
            }
            $result .= \Timber::compile_string(
                $data,
                array_merge(
                    $component->getModel(),
                    Context::getInstance()->toArray(),
                    array('component_id' => $component->getId())
                )
            );
        }

        if ($resourceType == Template::RESOURCE_CSS) {
            $result = Template::relativeToAbsoleteImages($result);
        } elseif ($resourceType == Template::RESOURCE_TPL ) {
            $result = str_replace(array('&#34;'), array('"'), $result);
            $result = do_shortcode($result);
        }
        return $result;
    }
}