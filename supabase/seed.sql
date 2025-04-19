INSERT INTO public.users (id,username,password,email,created_at) VALUES (43, 'Daron.Yundt', 'jTXidQuSdJyiQW8', 'Thaddeus69@gmail.com', '2024-10-17T07:01:14.172Z'), (44, 'Glenda.Hills', 'VuTesvw_qltUfAl', 'Kristofer.Witting@hotmail.com', '2025-03-04T14:56:28.350Z'), (45, 'Griffin_Wunsch', '0V3mIPWipflybwm', 'Savion98@yahoo.com', '2024-05-16T11:38:30.485Z'), (46, 'Rene_Kulas-Pfeffer', 'x6J6FeRYydqEBcV', 'Danika_Ebert@gmail.com', '2024-06-16T03:48:43.276Z'), (47, 'Paolo_Frami', 'VL50NcYYFw1ZiY0', 'Fannie_Kub40@gmail.com', '2024-07-31T10:52:48.475Z'), (48, 'Brent_Daugherty98', 'KKDx0EuK9xPZ_Yf', 'Ahmad.Oberbrunner71@yahoo.com', '2025-03-30T18:35:51.567Z'), (49, 'Harry.Altenwerth53', '6YEFmR6NOLSXiV8', 'Ford12@hotmail.com', '2024-08-21T12:48:34.246Z'), (50, 'Deontae_Stiedemann10', 'kr647o0YraWlrll', 'Jaqueline_Raynor@hotmail.com', '2024-06-18T20:15:38.836Z'), (51, 'Rodger.Armstrong', 'bMS_pefmiax0exs', 'Kenya_Kshlerin65@hotmail.com', '2025-01-15T17:55:17.947Z'), (52, 'Andres_Stroman0', 'IBAY9imiWcPga6G', 'Carmel_Dare@hotmail.com', '2024-07-24T16:50:22.677Z'), (53, 'Angelita.Kihn87', '4mq74ysjCZhkRva', 'Ashlynn.Barrows28@yahoo.com', '2024-10-04T07:48:42.920Z');
SELECT setval('"public"."users_id_seq"'::regclass, (SELECT MAX("id") FROM "public"."users"));
INSERT INTO public.users_metadata (id,user_id,first_name,last_name,avatar_url,is_online) VALUES (43, NULL, 'Daron', 'Yundt', 'https://randomuser.me/api/portraits/men/7.jpg', 't'), (44, NULL, 'Glenda', 'Hills', 'https://randomuser.me/api/portraits/women/26.jpg', 't'), (45, NULL, 'Griffin', 'Wunsch', 'https://randomuser.me/api/portraits/men/25.jpg', 't'), (46, NULL, 'Rene', 'Kulas-Pfeffer', 'https://randomuser.me/api/portraits/men/88.jpg', 't'), (47, NULL, 'Paolo', 'Frami', 'https://randomuser.me/api/portraits/men/53.jpg', 't'), (48, NULL, 'Brent', 'Daugherty', 'https://randomuser.me/api/portraits/men/75.jpg', 't'), (49, NULL, 'Harry', 'Altenwerth', 'https://randomuser.me/api/portraits/men/54.jpg', 't'), (50, NULL, 'Deontae', 'Stiedemann', 'https://randomuser.me/api/portraits/women/93.jpg', 't'), (51, NULL, 'Rodger', 'Armstrong', 'https://randomuser.me/api/portraits/men/43.jpg', 't'), (52, NULL, 'Andres', 'Stroman', 'https://randomuser.me/api/portraits/women/71.jpg', 't'), (53, NULL, 'Angelita', 'Kihn', 'https://randomuser.me/api/portraits/men/20.jpg', 't');
UPDATE public.users_metadata SET user_id = 43 WHERE id = 43;
UPDATE public.users_metadata SET user_id = 44 WHERE id = 44;
UPDATE public.users_metadata SET user_id = 45 WHERE id = 45;
UPDATE public.users_metadata SET user_id = 46 WHERE id = 46;
UPDATE public.users_metadata SET user_id = 47 WHERE id = 47;
UPDATE public.users_metadata SET user_id = 48 WHERE id = 48;
UPDATE public.users_metadata SET user_id = 49 WHERE id = 49;
UPDATE public.users_metadata SET user_id = 50 WHERE id = 50;
UPDATE public.users_metadata SET user_id = 51 WHERE id = 51;
UPDATE public.users_metadata SET user_id = 52 WHERE id = 52;
UPDATE public.users_metadata SET user_id = 53 WHERE id = 53;
SELECT setval('"public"."users_metadata_id_seq"'::regclass, (SELECT MAX("id") FROM "public"."users_metadata"));
INSERT INTO public.channels (id,name,is_group) VALUES (11, 'single_channel_0', 'f'), (12, 'single_channel_1', 'f'), (13, 'single_channel_2', 'f'), (14, 'single_channel_3', 'f'), (15, 'Kailash Trip', 't');
SELECT setval('"public"."channels_id_seq"'::regclass, (SELECT MAX("id") FROM "public"."channels"));
INSERT INTO public.channel_user_mapping (id,user_id,channel_id) VALUES (2065, 43, 11), (41596, 44, 11), (8449, 45, 12), (8894, 46, 12), (31238, 47, 13), (49133, 48, 13), (26333, 49, 14), (43964, 50, 14), (1038, 51, 15), (56861, 52, 15), (53467, 53, 15);
SELECT setval('"public"."channel_user_mapping_id_seq"'::regclass, (SELECT MAX("id") FROM "public"."channel_user_mapping"));
INSERT INTO public.last_sequence (channel_id,last_sequence) VALUES (11, 10), (12, 10), (13, 10), (14, 10), (15, 10);
INSERT INTO public.messages (entry_id,message_id,channel_id,sender_id,content,created_at) VALUES (101, 0, 11, 43, 'Auditor delinquo arcus socius expedita.', '2024-11-09T10:56:59.019Z'), (102, 1, 11, 43, 'Thermae caecus velum reiciendis vespillo tyrannus virga ago vergo repellendus bis condico.', '2025-01-05T09:19:20.367Z'), (103, 2, 11, 43, 'Commemoro auctus defessus est tamquam cavus vulnus demergo.', '2025-02-23T04:55:10.311Z'), (104, 3, 11, 44, 'Tabgo incidunt non torqueo demulceo tergo basium.', '2025-02-03T00:00:17.191Z'), (105, 4, 11, 44, 'Adhuc atavus vergo tersus.', '2024-09-17T15:01:11.864Z'), (106, 5, 11, 44, 'Abeo astrum atque sursum undique ascisco sonitus adipisci arceo contra deripio amplitudo.', '2024-11-15T16:34:00.511Z'), (107, 6, 11, 44, 'Cohaero urbs stultus vel depromo maxime sed abeo quidem porro ambulo alveus.', '2024-05-21T14:50:09.177Z'), (108, 7, 11, 44, 'Claudeo vix super comedo valens adicio.', '2024-11-20T00:36:18.486Z'), (109, 8, 11, 44, 'Socius tenus beatus tabula thema custodia dedico.', '2024-10-03T16:48:46.027Z'), (110, 9, 11, 44, 'Somniculosus acsi vulticulus vehemens.', '2025-02-11T20:51:02.002Z'), (111, 0, 12, 46, 'Ex abbas blanditiis deleniti deprimo curiositas vigor asporto curiositas virgo animi.', '2024-07-12T04:05:33.197Z'), (112, 1, 12, 46, 'Comparo vulgus pectus corpus supplanto tantillus curatio cauda thalassinus.', '2024-12-04T12:25:07.455Z'), (113, 2, 12, 46, 'Hic sit annus taedium alioqui voluptatem tres solum harum.', '2024-11-02T19:01:37.377Z'), (114, 3, 12, 46, 'Caput cohibeo stillicidium tredecim vito vilis arguo.', '2024-06-14T19:02:25.667Z'), (115, 4, 12, 45, 'Causa carbo tribuo ager nam.', '2024-09-22T18:59:45.177Z'), (116, 5, 12, 45, 'Ipsa adicio agnosco ubi.', '2024-09-13T06:26:35.963Z'), (117, 6, 12, 45, 'Cohaero acidus crux xiphias pectus demens vulgo claro ante sapiente.', '2024-08-04T23:32:41.466Z'), (118, 7, 12, 45, 'Amissio quibusdam verto cerno bestia.', '2025-01-03T02:03:00.077Z'), (119, 8, 12, 45, 'Baiulus spoliatio clementia sequi deputo volup caste dedecor demulceo.', '2024-07-13T05:42:07.951Z'), (120, 9, 12, 45, 'Tutamen subnecto vilicus ipsum tredecim solium nisi.', '2024-08-18T16:11:04.573Z'), (121, 0, 13, 47, 'Officiis damno tolero acsi cubitum corpus tenax repellat.', '2024-11-03T07:44:28.418Z'), (122, 1, 13, 48, 'Adeptio tum sophismata.', '2025-03-11T20:12:36.050Z'), (123, 2, 13, 48, 'Contra crux aspicio velum.', '2025-01-25T20:58:22.383Z'), (124, 3, 13, 48, 'In cenaculum allatus deinde articulus pecto vere ab.', '2024-12-20T04:34:57.239Z'), (125, 4, 13, 47, 'Thesis tempus adipisci tergiversatio vinitor congregatio quam.', '2024-08-26T09:37:24.379Z'), (126, 5, 13, 47, 'Suspendo sumo territo amor.', '2025-04-13T03:30:13.846Z'), (127, 6, 13, 47, 'Corrupti deludo adsidue angelus defluo tantillus.', '2025-03-03T07:00:26.798Z'), (128, 7, 13, 47, 'Speculum sed derelinquo apto consequatur adnuo.', '2024-07-29T14:08:04.458Z'), (129, 8, 13, 47, 'Cubitum verecundia curtus sponte placeat stipes.', '2025-02-04T04:17:28.513Z'), (130, 9, 13, 47, 'Adipisci nam molestias teres derelinquo tergum damnatio cui subiungo.', '2024-11-18T05:07:07.056Z'), (131, 0, 14, 49, 'Benevolentia subvenio cimentarius cohibeo verecundia sumo trepide solutio vorago.', '2025-02-08T03:47:20.427Z'), (132, 1, 14, 50, 'Aqua repellendus tamdiu attero copia.', '2024-10-28T04:26:57.872Z'), (133, 2, 14, 49, 'Vitiosus corrigo ultra cometes cunae.', '2024-10-01T13:22:19.179Z'), (134, 3, 14, 50, 'Defaeco sol clibanus cogito assentator perferendis circumvenio demonstro commodo.', '2024-08-20T02:31:48.343Z'), (135, 4, 14, 50, 'Comitatus tepesco aeneus tremo alienus subiungo considero vulgus conatus ademptio tersus.', '2025-02-16T12:27:56.524Z'), (136, 5, 14, 50, 'Avaritia ventosus confido deludo autem earum.', '2025-01-16T07:43:54.213Z'), (137, 6, 14, 49, 'Creo amet aequus aggredior demergo.', '2024-10-17T20:36:16.229Z'), (138, 7, 14, 49, 'Abduco explicabo trans arcesso numquam.', '2024-10-12T03:19:06.652Z'), (139, 8, 14, 50, 'Speciosus depereo ipsa aureus.', '2024-06-22T18:34:17.187Z'), (140, 9, 14, 49, 'Vitae vereor alius blandior antea sollers ubi cauda.', '2024-06-18T20:53:17.722Z'), (141, 0, 15, 52, 'Quae canonicus arcus angulus patria.', '2025-03-05T07:21:46.812Z'), (142, 1, 15, 51, 'Cognomen degenero cavus uterque.', '2024-10-28T08:46:37.363Z'), (143, 2, 15, 51, 'Cupressus clibanus conor.', '2024-07-13T02:34:03.816Z'), (144, 3, 15, 52, 'Velum corporis veritatis cunabula tertius tametsi animadverto.', '2024-07-21T14:24:00.352Z'), (145, 4, 15, 52, 'Curso conturbo tolero aetas paens comis traho crinis animus.', '2024-12-04T02:52:25.879Z'), (146, 5, 15, 53, 'Denuo architecto repellat.', '2024-06-01T19:44:32.352Z'), (147, 6, 15, 52, 'Thalassinus carbo nostrum volup sophismata victus texo angelus vito articulus depraedor.', '2024-05-21T03:56:56.695Z'), (148, 7, 15, 51, 'Via acies cruciamentum attollo aegrotatio venustas depopulo vigor amitto ver excepturi cervus.', '2024-08-05T08:52:34.040Z'), (149, 8, 15, 51, 'Spes clibanus amplexus bardus bis auctus.', '2024-11-02T06:34:11.555Z'), (150, 9, 15, 51, 'Acceptus utique curvo provident adfectus.', '2025-04-14T15:09:55.076Z');
SELECT setval('"public"."messages_entry_id_seq"'::regclass, (SELECT MAX("entry_id") FROM "public"."messages"));
