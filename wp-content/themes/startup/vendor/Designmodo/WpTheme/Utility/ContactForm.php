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
 * ContactForm provides features of contact form.
 */
class ContactForm
{

    /**
     * Contact form handler
     *
     * @return void
     */
    static public function handler()
    {
        // Email handler
        if (!empty($_REQUEST['sf_contact_form'])) {
            $formMsgs = array();
            $sender = empty($_REQUEST['sf_contact_form']['from']) ? '' : $_REQUEST['sf_contact_form']['from'];
            $senderName = empty($_REQUEST['sf_contact_form']['name']) ? '' : $_REQUEST['sf_contact_form']['name'];
            $message = empty($_REQUEST['sf_contact_form']['msg']) ? '' : $_REQUEST['sf_contact_form']['msg'];
            if ($sender && $message) {
                $subject = get_option('blogname') . ' | Contact form';
                Email::send($sender, get_option('admin_email'), $message, $subject, $senderName);
                $formMsgs['success'][] = __('Email was successfully sent.');
            } else {
                $formMsgs['error'][] = __('All field are required.');
            }
            Context::getInstance()->set('msgs', array_merge((array)Context::getInstance()->get('msgs'), $formMsgs));
        }
    }
}