<?php
/*
Plugin Name: Zawfm SEO Workflow
Description: WordPress automation layer for SEO metadata/schema updates and review queue
Version: 0.1.0
*/

if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', function () {
    register_rest_route('zawfm-seo/v1', '/apply-fix', [
        'methods' => 'POST',
        'permission_callback' => '__return_true',
        'callback' => function ($request) {
            $params = $request->get_json_params();
            $issue = $params['issue'] ?? [];
            $decision = $params['decision'] ?? 'manual';

            if (empty($issue)) {
                return new WP_REST_Response([
                    'status' => 'error',
                    'message' => 'No issue payload provided',
                ], 400);
            }

            $pageUrl = $issue['page_url'] ?? '';
            $pageId = url_to_postid($pageUrl);

            if (!$pageId) {
                return new WP_REST_Response([
                    'status' => 'error',
                    'message' => 'Page not found for URL: ' . $pageUrl,
                ], 404);
            }

            if ($decision === 'auto') {
                $title = get_the_title($pageId);
                $meta = [
                    'title' => $title . ' | SEO Update',
                    'description' => 'Updated by automated SEO workflow.',
                ];

                update_post_meta($pageId, '_zawfm_seo_title', $meta['title']);
                update_post_meta($pageId, '_zawfm_seo_description', $meta['description']);

                return new WP_REST_Response([
                    'status' => 'success',
                    'page_id' => $pageId,
                    'decision' => 'auto',
                    'message' => 'Auto fix applied successfully.',
                ], 200);
            }

            return new WP_REST_Response([
                'status' => 'queued',
                'page_id' => $pageId,
                'decision' => 'review',
                'message' => 'Fix has been queued for manual review.',
            ], 202);
        },
    ]);
});
