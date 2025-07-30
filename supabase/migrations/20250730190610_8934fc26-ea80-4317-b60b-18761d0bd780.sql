-- Create storage bucket for assets
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true);

-- Create policies for public access to assets
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'assets');

CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'assets');

CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'assets');

CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'assets');