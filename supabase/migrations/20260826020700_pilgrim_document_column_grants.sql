revoke insert, update on public.pilgrim_documents from authenticated;
grant insert (user_id,document_type,bucket,path,original_name,mime_type,file_size) on public.pilgrim_documents to authenticated;
grant update (path,original_name,mime_type,file_size,updated_at,deleted_at) on public.pilgrim_documents to authenticated;
