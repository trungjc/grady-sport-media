<?php
/*
 * This file is part of the Designmodo WordPress Theme.
 *
 * (c) Designmodo Inc. <info@designmodo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
namespace Designmodo\WpTheme\Utility;

/**
 * User provides features of WordPress users.
 */
class User
{
    /**
     * Registrantion of new user handler
     *
     * @return void
     */
    static public function registrationHandler()
    {
        if (!empty($_POST['sf_register_user'])) {
            $formMsgs = array();
            if (! empty($_POST['sf_register_user']['subscribe'])) {
                $_POST['sf_register_user']['pwd'] = $_POST['sf_register_user']['rpwd'] = md5(microtime(true) . @$_SERVER['REMOTE_ADDR']);
            }
            if (empty($_POST['sf_register_user']['email']) || !is_email($_POST['sf_register_user']['email'])) {
                $formMsgs['error'][] = __('Email must be specified.');
                $_POST['sf_register_user']['email'] = '';
            }
            if (isset($_POST['sf_register_user']['login']) && empty($_POST['sf_register_user']['login'])) {
                $formMsgs['error'][] = __('Unique name must be specified.');
            } elseif (!isset($_POST['sf_register_user']['login'])) {
                $_POST['sf_register_user']['login'] = $_POST['sf_register_user']['email'];
            }
            if (empty($_POST['sf_register_user']['pwd'])) {
                $formMsgs['error'][] = __('Password must be specified.');
            }
            if ($_POST['sf_register_user']['pwd'] !== $_POST['sf_register_user']['rpwd']) {
                $formMsgs['error'][] = __('Passwords must match.');
            }
            if (username_exists($_POST['sf_register_user']['login'])) {
                $formMsgs['error'][] = __('This user is exist already.');
            }
            if (empty($formMsgs['error'])) {
                if (wp_create_user($_POST['sf_register_user']['login'], $_POST['sf_register_user']['pwd'], $_POST['sf_register_user']['email'])) {
                    $formMsgs['success'][] = __('Your Email was successfully subscribed.');
                }
            }
            Context::getInstance()->set('msgs', array_merge((array)Context::getInstance()->get('msgs'), $formMsgs));
        }
    }
}