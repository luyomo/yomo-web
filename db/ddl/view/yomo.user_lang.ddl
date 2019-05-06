create or replace view yomo.user_lang as 
  WITH default_set AS (
         SELECT usr_master.role_name AS user_name,
            'name-en'::character varying AS value,
            0 AS priority
           FROM usr_master
          WHERE (usr_master.role_type = 'u'::bpchar)
        )
 SELECT DISTINCT t1.user_name,
    first_value(t1.value) OVER (PARTITION BY t1.user_name ORDER BY t1.priority DESC) AS lang
   FROM ( SELECT default_set.user_name,
            default_set.value,
            default_set.priority
           FROM default_set
        UNION
         SELECT t1_1.user_name,
            t2.config_value AS value,
            1 AS priority
           FROM default_set t1_1,
            sys_user_config t2
          WHERE ((t2.user_name)::text = 'default'::text)
        UNION
         SELECT sys_user_config.user_name,
            sys_user_config.config_value,
            2
           FROM sys_user_config
          WHERE (((sys_user_config.config_type)::text = 'language'::text) AND ((sys_user_config.user_name)::text <> 'default'::text))) t1;